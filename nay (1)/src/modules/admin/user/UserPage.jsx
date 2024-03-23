import { TextInput, Label, Button, Card, Avatar, Badge } from 'flowbite-react'
import React, { useMemo, useState, useEffect } from 'react'
import CustomDataTable from '../../../components/CustomDataTable'
import AxiosClient from '../../../config/http-client/axios-client';
import { IoIosAdd } from "react-icons/io";
import RegisterUserForm from './components/RegistroUserForm';
import UpdateUserForm from './components/UpdateUserForm'; 
import { MdEdit } from "react-icons/md";
import { TbUserExclamation } from "react-icons/tb";
import { confirmAlert, customAlert } from '../../../config/alerts/alert';

const UserPage = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [filterText, setFilterText] = useState('');
    const [users, setUsers] = useState([]);
    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const handleClickEdit = (user) => {
        setSelectedUser(user);
        setIsEditing(true);
    };
    const changeStatus = async (row) => {
        console.log(row);
        confirmAlert(async () => {
          try {
            const response = await AxiosClient({
              method: 'PATCH',
              url: `/user/${row.id}`,
              data:{
                user:{
                    id: row.id,
                    username: row.username,
                    password: row.password,
                    status: row.status
                }
              }
            });
            if (!response.error) {
              customAlert(
                'Actualización exitosa',
                'El estado del usuario ha sido actualizado correctamente',
                'success'
              );
              getUsers();
            }
          } catch (error) {
            customAlert(
              'Error',
              'Ha ocurrido un error, por favor intente de nuevo',
              'error'
            );
          }
        });
      }
    const columns = useMemo(() => [
        {
            name: '#',
            cell: (row, i) => <>{i + 1}</>,
            selector: (row, i) => i,
            sortable: true,
        },
        {
            name:"Avatar",
            cell:(row) => (<div>
                {row.avatar ? (
                    <Avatar img={row.avatar} alt={row.username} rounded />
                ) : ('NA')}
                </div>),
        },
        {
            name: 'Usuario',
            cell: (row) => <>{row.username}</>,
            selector: (row) => row.username,
            sortable: true,
        },
        {
            name: 'Nombre completo',
            cell: (row) => <>{`${row.person.name} ${row.person.surname} ${row.person.lastname ?? ''} `}</>,
            selector: (row) => `${row.person.name} ${row.person.surname} ${row.person.lastname ?? ''} `,
            //Selector es la guia del sortable, sortable se usa para ordenar
            sortable: true,
        },
        {
            name: 'Estado',
            cell: (row) => <>{row.status ? 
            <Badge color="success" size="sm"> Activo </Badge> 
            :
            <Badge color="failure" size="sm"> Inactivo </Badge>}</>,
            selector: (row) => row.status,
            sortable: true,
        },
        {
            name: 'Acciones',
            cell: (row) => (
              <>
                <Button outline color='warning' onClick={() => handleClickEdit(row)} pill>
                  <MdEdit size={24} />
                </Button>
                {isEditing && (
                  <UpdateUserForm
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    getAllUsers={getUsers}
                    selectedUser={selectedUser} 
                  />
                )}
                <Button outline color='failure' pill onClick={() => changeStatus(row)}>
                  <TbUserExclamation size={24} />
                </Button>
              </>
            ),
          },
    ]);
    //useMemo guarda como un cache para no renderizar varias veces
    const getUsers = async () => {
        try {
            const response = await AxiosClient({ url: "/user/", method: 'GET' });
            console.log(response);
            if (!response.error) setUsers(response.data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }
    //useEffect se puede usar para que se ejecute una vez que toda nuestra pantalla se haya renderizado
    //Si no le mandamos nada al arreglo, solo se ejecutara una vez que todo se haya renderizado
    useEffect(() => {
        setLoading(true);
        getUsers();
    }, []); //Solo se ejecuta una vez al terminar de renderizar
    return (
        <section className='w-full px-4 pt-4 flex flex-col gap-4'>
            <h1 className='text-2xl'>Usuarios</h1>
            <div className='flex justify-between'>
                <div className='max-w-64'>
                    <Label htmlFor='' />
                    <TextInput type='text' id='filter' placeholder='Buscar...' />
                </div>
                <Button outline color='success' onClick={()=> setIsCreating(true)} pill>
                <IoIosAdd size={24}/></Button>
                <RegisterUserForm isCreating={isCreating} setIsCreating={setIsCreating} getAllUsers={getUsers}/>
            </div>
            <Card>
                <CustomDataTable
                    columns={columns}
                    data={users}
                    isLoading={loading}
                />
            </Card>
        </section>
    )
}

export default UserPage