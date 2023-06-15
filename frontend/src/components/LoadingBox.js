import Spinner from 'react-bootstrap/Spinner';


export default function LoadingBox() {

    return (
        <Spinner className="container centrado-spinner"  animation="border" role="status">
            <span className="visually-hidden">Cargando...</span>
        </Spinner>
    )
}