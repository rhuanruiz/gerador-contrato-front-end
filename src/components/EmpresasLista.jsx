import React, { 
  useState, 
  useEffect 
} from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Box, 
  Button, 
  Paper
} from '@mui/material';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CriarEmpresa from './CriarEmpresa';
import axios from 'axios';


export default function EmpresasLista() {

    const [empresas, setEmpresas] = useState([]);
    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        const fetchEmpresas = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/empresa`);
                setEmpresas(response.data);
            } catch (error) {
                console.error('Ocorreu um erro, tente novamente.\nErro:', error);
            }
        };
        fetchEmpresas();
    }, []);

    const handleOpenModal = () => {
        setOpenModal(true);
    };
    
    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleDelete = async (empresa) => {
        try {
            const response = await axios.delete(`${process.env.REACT_APP_API_URL}/empresa/${empresa.id}`);
            console.log(response.data);
            setTimeout(() => {
              //this.msg_sucesso = '';
              window.location.reload(true);
            }, 2000);
        } catch (error) {
            console.error('Ocorreu um erro, tente novamente.\nErro:', error);
        }
    };

    return (
        <Box>
            <Button variant="contained" startIcon={<AddCircleIcon />} onClick={handleOpenModal}>Nova Empresa</Button>
            <CriarEmpresa open={openModal} onClose={handleCloseModal} />
                <Box sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <TableContainer component={ Paper }>
                        <Table sx={{ minWidth: 650 }} aria-label="empresas">
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Empresas</TableCell>
                                    <TableCell align="center">CNPJ</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {empresas.map((empresa) => (
                                    <TableRow key={ empresa.id }>
                                        <TableCell component="th" scope="row">{ empresa.nome }</TableCell>
                                        <TableCell>{empresa.cnpj}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleDelete(empresa)}>Excluir</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>  
                    </TableContainer>
                </Box>
        </Box>
    );
}