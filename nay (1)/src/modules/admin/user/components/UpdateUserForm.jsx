import { Button, Modal, Select, Label, TextInput, Datepicker, FileInput } from 'flowbite-react'
import React from 'react'
import { useFormik } from 'formik'
import * as yup from 'yup'
import { confirmAlert, customAlert } from '../../../../config/alerts/alert'
import AxiosClient from '../../../../config/http-client/axios-client'

const UpdateUserForm = ({ isCreating, setIsCreating, getAllUsers }) => {

    const closeModal = () => {
        setIsCreating(false);
    }

    const handleChangeAvatar = (event) => {
        console.log(files);
        const files = event.target.files;
        for (const file of files) {
            const reader = new FileReader();
            reader.onloadend = (data) => {
                formik.setFieldValue('avatar', true);
                formik.setFieldValue('avatar', data.currentTarget.result)
            }
            reader.readAsDataURL(file);
        }
    }

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
            confirmPassword: '',
            roles: '',
            name: '',
            lastname: '',
            lastname2: '',
            curp: '',
            birth_date: '',
            avatar: ''
        },
        validationSchema: yup.object().shape({
            username: yup
                .string()
                .required('El usuario es requerido')
                .min(4, 'El usuario debe tener al menos 4 caracteres')
                .max(45, 'El usuario debe tener máximo 45 caracteres'),
            password: yup
                .string()
                .required('La contraseña es requerida')
                .min(8, 'La contraseña debe tener al menos 8 caracteres')
                .max(45, 'La contraseña debe tener máximo 45 caracteres')
                .matches(
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un caracter especial'
                ),
            confirmPassword: yup
                .string()
                .required('La confirmación de contraseña es requerida')
                .test('password-matches', 'Las contraseña no coinciden',
                    function (value) {
                        return value === this.parent.password
                    }

                ),
            name: yup
                .string()
                .required('El nombre es requerido')
                .min(3, 'El nombre debe tener al menos 2 caracteres')
                .max(45, 'El nombre debe tener máximo 45 caracteres'),
            lastname: yup
                .string()
                .required('El apellido paterno es requerido')
                .max(45, "El apellido paterno debe tener máximo 45 caracteres")
                .min(3, 'El apellido paterno debe tener al menos 2 caracteres'),
            lastname2: yup
                .string(),
            curp: yup
                .string()
                .required("La CURP es requerida")
                .length(18, "La CURP debe tener 18 caracteres"),
            // .matches(/^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9]{2}$/, "El CURP no es valido"),
            birth_date: yup
                .date()
                .required("La fecha de nacimiento es requerida")
                .max(new Date(), "La fecha de nacimiento no puede ser mayor a la fecha actual"),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            confirmAlert(async () => {
                try {
                    const payload = {
                        ...values,
                        birth_date: values.birth_date,
                        user: {
                            username: values.username,
                            avatar: values.avatar,
                            password: values.password,
                            roles: [{ id: values.roles }]

                        }
                    }

                    const response = await AxiosClient({
                        method: 'POST',
                        url: '/person/',
                        data: payload
                    })
                    console.log(error);
                    if (!response.error) {
                        customAlert('Registro exitoso', 'Usuario registrado correctamente', 'success')
                        getAllUsers();
                        closeModal();
                    }
                    return response;

                } catch (error) {
                    customAlert('Ocurrio un error', 'Error al registrar usuario', 'error')
                    console.log(error);
                } finally {
                    setSubmitting(false);
                }
            });
        }
    })

    return (
        <Modal onClose={() => closeModal()} show={isCreating} size={'2xl'}>
            <Modal.Header>
                {/* Aquí puedes agregar cualquier contenido para el encabezado del modal */}
                <h3 className='font-bold'>Actualizar Datos de Usuario</h3>
            </Modal.Header>
            <Modal.Body>
                <form id="userForm" name='userForm' noValidate onSubmit={formik.handleSubmit}>
                    <div className='flex flex-col gap-2'>
                        <div className='grid grid-flow-row gap-2'>
                            <h3 className='font-bold text-2xl'>Datos de Usuario</h3>
                            <div className='grid grid-flow-col gap-2'>
                                <div className='grid-col-6'>
                                    <Label
                                        htmlFor='username'
                                        className='font-bold'
                                        value='Usuario'
                                    />
                                    <TextInput
                                        type='text'
                                        id='username'
                                        name='username'
                                        placeholder='Usuario'
                                        value={formik.values.username}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.username && formik.errors.username
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.username}
                                                </span>) : null
                                        }
                                    />
                                </div>
                                <div className='grid-col-6'>
                                    <Label
                                        htmlFor='roles'
                                        className='font-bold'
                                        value='Roles'
                                    />
                                    <Select
                                        id='roles'
                                        name='roles'
                                        placeholder='Seleccionar rol...'
                                        value={formik.values.roles}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.roles && formik.errors.roles
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.roles}
                                                </span>) : null
                                        }
                                    >
                                        <option value="">Selecciona rol...</option>
                                        <option value="1">Administrador</option>
                                        <option value="2">Usuario</option>
                                        <option value="3">Cliente</option>
                                    </Select>
                                </div>
                            </div>
                            <div className='grid grid-flow-col gap-2'>
                                <div className='grid-col-6'>
                                    <Label
                                        htmlFor='password'
                                        className='font-bold'
                                        value='Contraseña'
                                    />
                                    <TextInput
                                        type='password'
                                        id='password'
                                        name='password'
                                        placeholder='**********'
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.password && formik.errors.password
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.password}
                                                </span>) : null
                                        }
                                    />
                                </div>
                                <div className='grid-col-6'>
                                    <Label
                                        htmlFor='confirmPassword'
                                        className='font-bold'
                                        value='Confirmar contraseña'
                                    />
                                    <TextInput
                                        type='password'
                                        id='confirmPassword'
                                        name='confirmPassword'
                                        placeholder='**********'
                                        value={formik.values.confirmPassword}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.confirmPassword && formik.errors.confirmPassword
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.confirmPassword}
                                                </span>) : null
                                        }
                                    />
                                </div>
                            </div>
                            {/* input para agregar avatar */}
                            <div className='grid grid-flow-col gap-2'>
                                <div className='grid-col-6'>
                                    <Label
                                        htmlFor='avatar'
                                        className='font-bold'
                                        value='Avatar'
                                    />
                                    <FileInput
                                        type='file'
                                        id='avatar'
                                        name='avatar'
                                        onChange={(e) => handleChangeAvatar(e)}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className='grid grid-flow-row gap-2'>
                            <h3 className='font-bold text-2xl'>Datos Personales</h3>
                            <div className='grid grid-flow-col gap-2'>
                                <div className='grid-col-4'>
                                    <Label
                                        htmlFor='name'
                                        className='font-bold'
                                        value='Nombre'
                                    />
                                    <TextInput
                                        type='text'
                                        id='name'
                                        name='name'
                                        placeholder='Alan'
                                        value={formik.values.name}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.name && formik.errors.name
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.name}
                                                </span>) : null
                                        }
                                    />
                                </div>
                                <div className='grid-col-4'>
                                    <Label
                                        htmlFor='lastname'
                                        className='font-bold'
                                        value='Apellido Paterno'
                                    />
                                    <TextInput
                                        type='text'
                                        id='lastname'
                                        name='lastname'
                                        placeholder='Yagami'
                                        value={formik.values.lastname}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.lastname && formik.errors.lastname
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.lastname}
                                                </span>) : null
                                        }
                                    />
                                </div>
                                <div className='grid-col-4'>
                                    <Label
                                        htmlFor='lastname2'
                                        className='font-bold'
                                        value='Apellido Materno'
                                    />
                                    <TextInput
                                        type='text'
                                        id='lastname2'
                                        name='lastname2'
                                        placeholder='Garcia'
                                        value={formik.values.lastname2}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.lastname2 && formik.errors.lastname2
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.lastname2}
                                                </span>) : null
                                        }
                                    />
                                </div>
                            </div>

                            <div className='grid grid-flow-col gap-2'>
                                <div className='grid-col-6'>
                                    <Label
                                        htmlFor='curp'
                                        className='font-bold'
                                        value='CURP'
                                    />
                                    <TextInput
                                        type='text'
                                        id='curp'
                                        name='curp'
                                        placeholder='BEGA040809'
                                        value={formik.values.curp}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.curp && formik.errors.curp
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.curp}
                                                </span>) : null
                                        }
                                    />
                                </div>
                                <div className='grid-col-6'>
                                    <Label
                                        htmlFor='birthdate'
                                        className='font-bold'
                                        value='Fecha de Nacimiento'
                                    />
                                    <TextInput
                                        title='Fecha de Nacimiento'
                                        language="mx"
                                        type='date'
                                        id='birth-date'
                                        name='birth-date'
                                        value={formik.values.birthdate}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        helperText={
                                            formik.touched.birthdate && formik.errors.birthdate
                                                ? (<span className='text-red-600'>
                                                    {formik.errors.birthdate}
                                                </span>) : null
                                        }
                                    />
                                </div>
                            </div>


                        </div>
                    </div>
                </form>
            </Modal.Body>
            <Modal.Footer className='flex justify-end gap-2'>
                <Button
                    onClick={closeModal}
                    outline
                    color='gray'
                    pill
                >Cancelar</Button>

                <Button
                    color='success'
                    pill
                    type='submit'
                    form='userForm'
                    disabled={formik.isSubmitting || !formik.isValid}
                >Guardar</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UpdateUserForm
