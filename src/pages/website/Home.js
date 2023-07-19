import { useContext } from "react";
import { AuthContext } from "../../contexts/auth";

export default function Home() {
    const { user } = useContext(AuthContext)

    return (
    <div>
        <h1>Hello { user ? user.username : 'Annonymus'}</h1>
        <p>Some content</p>
    </div>
    );
}