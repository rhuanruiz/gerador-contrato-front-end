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
import DownloadIcon from '@mui/icons-material/Download';
import CriarEmpresa from './CriarEmpresa';
import axios from 'axios';
import { styled } from '@mui/material/styles';

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
    const [prazo_exec_tempo, setPrazoExecTempo] = useState('');
    const [prazo_vig, setPrazoVig] = useState('');
    const [prazo_vig_tempo, setPrazoVigTempo] = useState('');

    //  Outros
    const [objeto, setObjeto] = useState('');
    const [n_contrato, setNContrato] = useState('');
    const [data_base, setDataBase] = useState('');
    const [data_base_mes, setDataBaseMes] = useState('');
    const [documento_base, setDocumentoBase] = useState('');
    const [termo_cooperacao, setTermoCooperacao] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [feedback, setFeedback] = useState(null);

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

    const handleGerar = async (tipo) => {
        try {
            if (activeStep === 5) {
                if (
                    !objeto.trim() ||
                    !data_base.trim() ||
                    !data_base_mes.trim() ||
                    !documento_base.trim() ||
                    !termo_cooperacao.trim()
                ) {
                    setFeedback({
                        type: 'error',
                        message: 'Todos os campos devem ser preenchidos.'
                    });
                    return;
                }
            }

            const registroGeral = {
                numero: registro_geral.trim(),
                orgaoExpedidor: orgao_expedidor.trim()
            };

            const enderecoRepresentante = {
                enderecoCompleto: endereco_representante.trim(),
                cidade: cidade.trim(),
                estado: estado
            };

            const dadosRepresentante = {
                nome_representante: nome_representante.trim(),
                naturalidade: naturalidade.trim(),
                estadoCivil: estado_civil.trim(),
                profissao: profissao.trim(),
                cpf: cpf.trim(),
                registroGeral,
                enderecoRepresentante
            };

            const tempo_exec = formatarTempo(prazo_exec_tempo);
            const tempo_vig = formatarTempo(prazo_vig_tempo);

            const dadosDocumento = {
                n_contrato: n_contrato.trim(),
                objeto: objeto.trim(),
                valor: valor.trim(),
                funcao: funcao.trim(),
                sub_funcao: sub_funcao.trim(),
                programa: programa.trim(),
                acao: acao.trim(),
                natureza_despesa: natureza_despesa.trim(),
                sub_elemento: sub_elemento.trim(),
                fonte: fonte.trim(),
                origem_recurso: origem_recurso.trim(),
                prazo_exec: prazo_exec.trim(),
                prazo_exec_tempo: tempo_exec,
                prazo_vig: prazo_vig.trim(),
                prazo_vig_tempo: tempo_vig,
                data_base: data_base_mes + "/" + data_base.trim(),
                documento_base: documento_base.trim(),
                termo_cooperacao: termo_cooperacao.trim()
            };
            const dados = {
                idEmpresa: empresaSelecionada.id,
                tipoDoc: tipo,
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

    const formatarTempo = (tempo) => {
        if (tempo === "dias") {
            return "dia";
        } else if (tempo === "semanas") {
            return "semana";
        } else if (tempo === "meses") {
            return "mês";
        } else if (tempo === "anos"){
            return "ano";
        } else {
            return tempo;
        }
    }

    const formatarCPF = (cpf) => {
        const valor = cpf.replace(/\D/g, '');
        const valorLimitado= valor.slice(0, 11);
        const cpfFormatado= valorLimitado.replace(
            /^(\d{3})(\d{3})?(\d{3})?(\d{0,2})?/,
            (match, p1, p2, p3, p4) =>
                p1 + (p2 ? `.${p2}` : '') + (p3 ? `.${p3}` : '') + (p4 ? `-${p4}` : '')
        );
        return cpfFormatado;
      };

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleNextStep = () => {
        if (activeStep === 1 && !empresaSelecionada) {
            setFeedback({
                type: 'error',
                message: 'Selecione ou cadastre uma empresa.'
            });
            return;
        }

        if (activeStep === 2) {
            if(
                !nome_representante.trim() ||
                !naturalidade.trim() ||
                !estado_civil.trim() ||
                !profissao.trim() ||
                !registro_geral.trim() ||
                !orgao_expedidor.trim() || 
                !cpf.trim() ||
                !endereco_representante.trim() ||
                !cidade.trim() || 
                !estado.trim()
            ) {
                setFeedback({
                    type: 'error',
                    message: 'Todos os campos devem ser preenchidos.'
                });
                return;
            }
            if (cpf.length !== 14) {
                setFeedback({
                    type: 'error',
                    message: 'CPF no formato inválido.'
                });
                return;
            }
        }

        if (activeStep === 3) {
            if (
                !valor.trim() ||
                !funcao.trim() ||
                !sub_funcao.trim() ||
                !programa.trim() ||
                !acao.trim() ||
                !natureza_despesa.trim() ||
                !sub_elemento.trim() ||
                !fonte.trim() ||
                !origem_recurso.trim()
            ) {
                setFeedback({
                    type: 'error',
                    message: 'Todos os campos devem ser preenchidos.'
                });
                return;    
            }
        }

        if (activeStep === 4) {
            if (
                !prazo_exec.trim() ||
                !prazo_exec_tempo?.trim() ||
                !prazo_vig.trim() ||
                !prazo_vig_tempo?.trim()
            ) {
                setFeedback({
                    type: 'error',
                    message: 'Todos os campos devem ser preenchidos.'
                });
                return;   
            }
        }

        setFeedback(null);
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handlePreviousStep = () => {
        setFeedback(null);
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
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const output = input.slice(0, 200);
                                        setNomeRepresentante(output);
                                    }}
                                    style={{display: "flex", flexDirection: "column", marginBottom: "1rem"}}
                                />
                                <Box>
                                    <TextField
                                        required
                                        id="naturalidade"
                                        label="Naturalidade"
                                        value={naturalidade}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = input.slice(0, 30);
                                            setNaturalidade(output);
                                        }}
                                        style={{marginLeft: "0.7rem", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="estado-civil"
                                        label="Estado Civil"
                                        value={estado_civil}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = input.slice(0, 30);
                                            setEstadoCivil(output);
                                        }}
                                        style={{marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="profissao"
                                        label="Profissão"
                                        value={profissao}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = input.slice(0, 60);
                                            setProfissao(output);
                                        }}
                                        style={{marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Box>
                                    <TextField
                                        required
                                        id="registro-geral"
                                        label="RG"
                                        value={registro_geral}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 14);
                                            setRegistroGeral(output);
                                        }}
                                        style={{marginLeft: "0.7rem", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="orgao-expedidor"
                                        label="Órgão Expedidor"
                                        value={orgao_expedidor}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = input.slice(0, 20);
                                            setOrgaoExpedidor(output);
                                        }}
                                        style={{marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="cpf"
                                        label="CPF"
                                        value={cpf}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = formatarCPF(input);
                                            setCPF(output);
                                        }}
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
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = input.slice(0, 50);
                                            setCidade(output);
                                        }}
                                        style={{width: "15rem", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="estado"
                                        options={["", ...estadosEnum]}
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
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const numerico = input.replace(/\D/g, '');
                                        const output = numerico.slice(0, 35);
                                        setValor(output);
                                    }}
                                    style={{width: "48rem",display: "flex", flexDirection: "column", marginBottom: "1rem"}}
                                />
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="funcao"
                                        label="Função"
                                        value={funcao}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 35);
                                            setFuncao(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="sub_funcao"
                                        label="SubFunção"
                                        value={sub_funcao}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 35);
                                            setSubFuncao(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="programa"
                                        label="Programa"
                                        value={programa}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 35);
                                            setPrograma(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="acao"
                                        label="Ação"
                                        value={acao}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 35);
                                            setAcao(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="natureza_despesa"
                                        label="Natureza de Despesa"
                                        value={natureza_despesa}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 35);
                                            setNaturezaDespesa(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="sub_elemento"
                                        label="SubElemento"
                                        value={sub_elemento}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 35);
                                            setSubElemento(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginBottom: "1rem"}}
                                    />
                                </Box>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="fonte"
                                        label="Fonte"
                                        value={fonte}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 35);
                                            setFonte(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <TextField
                                        required
                                        id="origem_recurso"
                                        label="Origem do Recurso (ex: Tesouro Municipal)"
                                        value={origem_recurso}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = input.slice(0, 35);
                                            setOrigemRecurso(output);
                                        }}
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
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 6);
                                            setPrazoExec(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="exec_tempo"
                                        options={["", "dias", "semanas", "meses", "anos"]}
                                        getOptionLabel={(temp) => temp} 
                                        onChange={(event, newValue) => setPrazoExecTempo(newValue)}
                                        value={prazo_exec_tempo}
                                        sx={{width: "15rem", display: "flex", marginBottom: "1rem"}}
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
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 6);
                                            setPrazoVig(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="exec_vig"
                                        options={["", "dias", "semanas", "meses", "anos"]}
                                        getOptionLabel={(temp) => temp} 
                                        onChange={(event, newValue) => setPrazoVigTempo(newValue)}
                                        value={prazo_vig_tempo}
                                        sx={{width: "15rem", display: "flex", marginBottom: "1rem"}}
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
                                <Div>{"Contrato:"}</Div>
                                <TextField
                                    required
                                    id="n_contrato"
                                    label="Número do contrato"
                                    value={n_contrato}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const output = input.slice(0, 30);
                                        setNContrato(output);
                                    }}
                                    style={{width: "48rem",display: "flex", flexDirection: "column", marginBottom: "1rem"}}
                                />
                                <Div>{"Clásula Primeira - Do Objeto:"}</Div>
                                <TextField
                                    required
                                    id="objeto"
                                    label="Objeto"
                                    value={objeto}
                                    onChange={(e) => {
                                        const input = e.target.value;
                                        const output = input.slice(0, 30);
                                        setObjeto(output);
                                    }}
                                    style={{width: "48rem",display: "flex", flexDirection: "column", marginBottom: "1rem"}}
                                />
                                <Div>{"Data Base do Reajustamento de Preços e Repactuação:"}</Div>
                                <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    <TextField
                                        required
                                        id="data_base"
                                        label="Dia"
                                        value={data_base}
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const numerico = input.replace(/\D/g, '');
                                            const output = numerico.slice(0, 2);
                                            setDataBase(output);
                                        }}
                                        style={{width: "23.5rem", display: "flex", marginRight: "1rem", marginBottom: "1rem"}}
                                    />
                                    <Autocomplete
                                        disablePortal
                                        id="data_base_mes"
                                        options={["", ...mesesEnum]}
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
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = input.slice(0, 30);
                                            setDocumentoBase(output);
                                        }}
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
                                        onChange={(e) => {
                                            const input = e.target.value;
                                            const output = input.slice(0, 30);
                                            setTermoCooperacao(output);
                                        }}
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
                        {activeStep > 1 && (
                            <Button variant="contained" onClick={handlePreviousStep} style={{ marginRight: '1.25rem' }}>
                                Voltar
                            </Button>
                        )}
                        <Button variant="contained" color="error" onClick={onClose} style={{ marginRight: '1.25rem' }}>
                            Fechar
                        </Button>
                        {activeStep < totalSteps && (
                            <Button variant="contained" onClick={handleNextStep}>
                                Avançar
                            </Button>
                        )}
                        {activeStep === totalSteps && (
                            <>
                                <Button color="success" startIcon={<DownloadIcon />} variant="contained" onClick={() => handleGerar("docx")} style={{ marginRight: '1.25rem' }}>
                                    docx
                                </Button>
                            </>
                        )}
                    </Box>             
                </Box>
            </Modal>
        </div>
    );
};

export default GerarDocumento;