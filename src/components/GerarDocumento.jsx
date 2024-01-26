import React, { 
    useState,
    useEffect
} from 'react';
import { 
    Modal, 
    Box,
    Typography, 
    TextField, 
    Button,
    Autocomplete,
    IconButton,
    Alert
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import CriarEmpresa from './CriarEmpresa';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { saveAs } from 'file-saver';

const Div = styled('div')(({ theme }) => ({
    ...theme.typography.button,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(1),
    fontWeight: 'bold'
}));

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1em'
};

const GerarDocumento = ({ open, onClose }) => {
    //  Empresa
    const [empresas, setEmpresas] = useState([]);
    const [empresaSelecionada, setEmpresaSelecionada] = useState(null);

    //  Representante
    const [nome_representante, setNomeRepresentante] = useState('');
    const [naturalidade, setNaturalidade] = useState('');
    const [estado_civil, setEstadoCivil] = useState('');
    const [profissao, setProfissao] = useState('');
    const [registro_geral, setRegistroGeral] = useState('');
    const [orgao_expedidor, setOrgaoExpedidor] = useState('');
    const [cpf, setCPF] = useState('');
    const [endereco_representante, setEnderecoRepresentante] = useState('');
    const [cidade, setCidade] = useState('');
    const [estado, setEstado] = useState('');

    //  Recursos Orçamentários
    const [valor, setValor] = useState('');

    const [funcao, setFuncao] = useState('');
    const [sub_funcao, setSubFuncao] = useState('');
    const [programa, setPrograma] = useState('');
    const [acao, setAcao] = useState('');
    const [natureza_despesa, setNaturezaDespesa] = useState('');
    const [sub_elemento, setSubElemento] = useState('');
    const [fonte, setFonte] = useState('');
    const [origem_recurso, setOrigemRecurso] = useState('');

    //  Prazos
    const [prazo_exec, setPrazoExec] = useState('');
    let [prazo_exec_tempo, setPrazoExecTempo] = useState('');
    const [prazo_vig, setPrazoVig] = useState('');
    let [prazo_vig_tempo, setPrazoVigTempo] = useState('');

    //  Outros
    const [objeto, setObjeto] = useState('');

    const [data_base, setDataBase] = useState('');
    const [data_base_mes, setDataBaseMes] = useState('');
    const [documento_base, setDocumentoBase] = useState('');
    const [termo_cooperacao, setTermoCooperacao] = useState('');

    const [openModal, setOpenModal] = useState(false);
    const [activeStep, setActiveStep] = useState(1);

    const [feedback, setFeedback] = useState(null);

    const tempoEnum = [
        "dias",
        "semanas",
        "meses",
        "anos"
    ];

    const mesesEnum = [
        "Janeiro",
        "Fevereiro",
        "Março",
        "Abril",
        "Maio",
        "Junho",
        "Julho",
        "Agosto",
        "Setembro",
        "Outubro",
        "Novembro",
        "Dezembro"
    ];

    const estadosEnum = [
        "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS",
        "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC",
        "SP", "SE", "TO"
    ];

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/empresa`);
                setEmpresas(response.data);
            } catch (error) {
                console.error('Ocorreu um erro, tente novamente.\nErro:', error);
            }
        };

        if (open) {
          fetchEmpresas();
        }
    }, [open]);

    const handleGerar = async () => {
        try {
            handleFormat();

            const registroGeral = {
                numero: registro_geral,
                orgaoExpedidor: orgao_expedidor
            };

            const enderecoRepresentante = {
                enderecoCompleto: endereco_representante,
                cidade: cidade,
                estado: estado
            };

            const dadosRepresentante = {
                nome_representante: nome_representante,
                naturalidade: naturalidade,
                estadoCivil: estado_civil,
                profissao: profissao,
                cpf: cpf,
                registroGeral,
                enderecoRepresentante
            };

            const dadosDocumento = {
                objeto: objeto,
                valor: valor,
                funcao: funcao,
                sub_funcao: sub_funcao,
                programa: programa,
                acao: acao,
                natureza_despesa: natureza_despesa,
                sub_elemento: sub_elemento,
                fonte: fonte,
                origem_recurso: origem_recurso,
                prazo_exec: prazo_exec,
                prazo_exec_tempo: prazo_exec_tempo,
                prazo_vig: prazo_vig,
                prazo_vig_tempo: prazo_vig_tempo,
                data_base: data_base_mes + "/" + data_base,
                documento_base: documento_base,
                termo_cooperacao: termo_cooperacao
            };
            const dados = {
                idEmpresa: empresaSelecionada.id,
                dadosRepresentante,
                dadosDocumento
            };

            const response = await axios.post(`${process.env.REACT_APP_API_URL}/documento`, dados, {
                responseType: 'arraybuffer',
            });

            const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });

            setFeedback({
                type: 'success',
                message: 'Documento gerado com sucesso!'
            });

            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = 'contrato.docx';
            link.addEventListener('click', () => {
                setTimeout(() => {
                    window.location.reload(true);
                }, 3000);
            });
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            setFeedback({
                type: 'error',
                message: 'Ocorreu um erro, tente novamente.'
            });
            console.error('Ocorreu um erro, tente novamente.\nErro:', error);
        }
    };

    const handleFormat = () => {
        if (prazo_exec === "1") {
            if (prazo_exec_tempo === "dias") {
                prazo_exec_tempo = "dia";
            } else if (prazo_exec_tempo === "semanas") {
                prazo_exec_tempo = "semana";
            } else if (prazo_exec_tempo === "meses") {
                prazo_exec_tempo = "mês";
            } else {
                prazo_exec_tempo = "ano";
            }
        }
        if (prazo_vig === "1") {
            if (prazo_vig_tempo === "dias") {
                prazo_vig_tempo = "dia";
            } else if (prazo_vig_tempo === "semanas") {
                prazo_vig_tempo = "semana";
            } else if (prazo_vig_tempo === "meses") {
                prazo_vig_tempo = "mês";
            } else {
                prazo_vig_tempo = "ano";
            }
        }
    }

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleNextStep = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const totalSteps = 5;

    return (
        <div>
            <Modal
                open={open}
                onClose={onClose}
            >
                <Box sx={style}>
                    {activeStep === 1 && (
                        <>
                            <Typography id="gerar-documento" variant="h6" component="h2" align="center" >
                                Selecione ou cadastre uma empresa:
                            </Typography>
                            <Box sx={{ display: "flex" }}>
                                <Autocomplete
                                    disablePortal
                                    id="combo-box-demo"
                                    options={empresas}
                                    getOptionLabel={(empresa) => empresa.nome} 
                                    onChange={(event, newValue) => setEmpresaSelecionada(newValue)}
                                    value={empresaSelecionada}
                                    sx={{ width: 300 }}
                                    renderInput={(params) => (
                                        <TextField 
                                            {...params}
                                            label={
                                                empresas.length === 0
                                                    ? "Não há empresas cadastradas"
                                                    : "Selecione a Empresa"
                                            }
                                        />
                                    )}
                                />
                                <IconButton color="primary" onClick={handleOpenModal} aria-label="add" size="large">
                                    <AddCircleIcon />
                                </IconButton>   
                                <CriarEmpresa open={openModal} onClose={handleCloseModal} />
                            </Box>
                        </>
                    )} 
                    {activeStep === 2 && (
                        <>
                            {
                            <Box>
                                <Div>{"Preencha as informações do Representante:"}</Div>
                                <TextField
                                    required
                                    id="nome-representante"
                                    label="Nome"
                                    value={nome_representante}
                                    onChange={(e) => setNomeRepresentante(e.target.value)}
                                    style={{display: "flex", flexDirection: "column", marginBottom: "1rem"}}
                                />
                                <Box>
                                    <TextField
                                        required
                                        id="naturalidade"
                                        label="Naturalidade"
                                        value={naturalidade}
                                        onChange={(e) => setNaturalidade(e.target.value)}
                                        style={{marginLeft: "0.7rem", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="estado-civil"
                                        label="Estado Civil"
                                        value={estado_civil}
                                        onChange={(e) => setEstadoCivil(e.target.value)}
                                        style={{marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="profissao"
                                        label="Profissão"
                                        value={profissao}
                                        onChange={(e) => setProfissao(e.target.value)}
                                        style={{marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        required
                                        id="registro-geral"
                                        label="RG"
                                        value={registro_geral}
                                        onChange={(e) => setRegistroGeral(e.target.value)}
                                        style={{marginLeft: "0.7rem", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="orgao-expedidor"
                                        label="Órgão Expedidor"
                                        value={orgao_expedidor}
                                        onChange={(e) => setOrgaoExpedidor(e.target.value)}
                                        style={{marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="cpf"
                                        label="CPF"
                                        value={cpf}
                                        onChange={(e) => setCPF(e.target.value)}
                                        style={{marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <TextField
                                    required
                                    id="endereco-representante"
                                    label="Endereço Completo"
                                    value={endereco_representante}
                                    onChange={(e) => setEnderecoRepresentante(e.target.value)}
                                    style={{display: "flex", flexDirection: "column", marginBottom: "1rem"}}
                                />
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="cidade"
                                        label="Cidade"
                                        value={cidade}
                                        onChange={(e) => setCidade(e.target.value)}
                                        style={{width: "15rem", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="estado"
                                        options={estadosEnum}
                                        getOptionLabel={(estado) => estado} 
                                        onChange={(event, newValue) => setEstado(newValue)}
                                        value={estado}
                                        sx={{width: "15rem", display: "flex", marginBottom: "1rem"}}
                                        renderInput={(params) => ( <TextField {...params} label={"Estado"}/>
                                        )}
                                    />
                                </Box>
                            </Box>
                            }
                        </>
                    )} 
                    {activeStep === 3 && (
                        <>
                            {
                            <Box>
                                <Div>{"Recursos Orçamentários:"}</Div>
                                <TextField
                                    required
                                    id="valor"
                                    label="Valor Contratual"
                                    value={valor}
                                    onChange={(e) => setValor(e.target.value)}
                                    style={{width: "48rem",display: "flex", flexDirection: "column", marginBottom: "1rem"}}
                                />
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="funcao"
                                        label="Função"
                                        value={funcao}
                                        onChange={(e) => setFuncao(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="sub_funcao"
                                        label="SubFunção"
                                        value={sub_funcao}
                                        onChange={(e) => setSubFuncao(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="programa"
                                        label="Programa"
                                        value={programa}
                                        onChange={(e) => setPrograma(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="acao"
                                        label="Ação"
                                        value={acao}
                                        onChange={(e) => setAcao(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="natureza_despesa"
                                        label="Natureza de Despesa"
                                        value={natureza_despesa}
                                        onChange={(e) => setNaturezaDespesa(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="sub_elemento"
                                        label="SubElemento"
                                        value={sub_elemento}
                                        onChange={(e) => setSubElemento(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="fonte"
                                        label="Fonte"
                                        value={fonte}
                                        onChange={(e) => setFonte(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="origem_recurso"
                                        label="Origem do Recurso"
                                        value={origem_recurso}
                                        onChange={(e) => setOrigemRecurso(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                            </Box>
                            }
                        </>
                    )} 
                    {activeStep === 4 && (
                        <>
                            {
                            <Box>
                                <Div>{"Prazos:"}</Div>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="prazo_exec"
                                        label="Prazo de Execução"
                                        value={prazo_exec}
                                        onChange={(e) => setPrazoExec(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="prazo_exec_tempo"
                                        options={tempoEnum}
                                        getOptionLabel={(tempo) => tempo} 
                                        onChange={(event, newValue) => setPrazoExecTempo(newValue)}
                                        value={prazo_exec_tempo}
                                        sx={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                        renderInput={(params) => ( <TextField {...params} label={"Tempo"}/>
                                        )}
                                    />
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="prazo_vig"
                                        label="Prazo de Vigência"
                                        value={prazo_vig}
                                        onChange={(e) => setPrazoVig(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="prazo_vig_tempo"
                                        options={tempoEnum}
                                        getOptionLabel={(tempo) => tempo} 
                                        onChange={(event, newValue) => setPrazoVigTempo(newValue)}
                                        value={prazo_vig_tempo}
                                        sx={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                        renderInput={(params) => ( <TextField {...params} label={"Tempo"}/>
                                        )}
                                    />
                                </Box>
                            </Box>
                            }
                        </>
                    )} 
                    {activeStep === 5 && (
                        <>
                            {
                            <Box>
                                <Div>{"Clásula Primeira - Do Objeto:"}</Div>
                                    <TextField
                                        required
                                        id="objetivo"
                                        label="Objeto"
                                        value={objeto}
                                        onChange={(e) => setObjeto(e.target.value)}
                                        style={{width: "48rem",display: "flex", flexDirection: "column", marginBottom: "1rem"}}
                                    />
                                    <Div>{"Data Base do Reajustamento de Preços e Repactuação:"}</Div>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="data_base"
                                        label="Dia"
                                        value={data_base}
                                        onChange={(e) => setDataBase(e.target.value)}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="data_base_mes"
                                        options={mesesEnum}
                                        getOptionLabel={(mes) => mes} 
                                        onChange={(event, newValue) => setDataBaseMes(newValue)}
                                        value={data_base_mes}
                                        sx={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                        renderInput={(params) => ( <TextField {...params} label={"Mês"}/>
                                        )}
                                    />
                                </Box>
                                <Div>{"Clásula Vigésima Segunda - Da Legislação:"}</Div>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="documento_base"
                                        label="Documento (ex: CONCORRÊNCIA Nº. 12/2023)"
                                        value={documento_base}
                                        onChange={(e) => setDocumentoBase(e.target.value)}
                                        style={{width: "48rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Div>{"Clásula Vigésima Terceira - Do Termo de Cooperação:"}</Div>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="termo_cooperacao"
                                        label="Número do termo (ex: 001/2023)"
                                        value={termo_cooperacao}
                                        onChange={(e) => setTermoCooperacao(e.target.value)}
                                        style={{width: "48rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                            </Box>
                            }
                        </>
                    )} 
                    {feedback && (
                        <Alert icon={feedback.type === 'success' ? <CheckIcon /> : <ErrorIcon />} severity={feedback.type}>
                            {feedback.message}
                        </Alert>
                    )}
                    <Box>
                        <Button variant="contained" color="error" onClick={onClose} style={{ marginRight: '1.25rem' }}>
                            Fechar
                        </Button>
                        {activeStep > 1 && (
                            <Button variant="contained" onClick={handlePreviousStep} style={{ marginRight: '1.25rem' }}>
                                Voltar
                            </Button>
                        )}
                        {activeStep < totalSteps && (
                            <Button variant="contained" onClick={handleNextStep}>
                                Avançar
                            </Button>
                        )}
                        {activeStep === totalSteps && (
                            <Button variant="contained" onClick={handleGerar}>
                                Gerar
                            </Button> 
                        )}
                    </Box>             
                </Box>
            </Modal>
        </div>
    );
};

export default GerarDocumento;