import logo from "../../assets/images/logo.png";
import {useState} from "react";
import {login, me} from "../../api/endpoints/userEndpoints.ts";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {completeLogin, simpleLogin} from "../../reducers/userReducer.ts";
import jwtDecoder from "../../utils/jwtDecoder.ts";
import {LoginError, type LoginErrorState} from "../../api/endpoints/errors/UserErrors.ts";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [inputErrors, setInputErrors] = useState<string[]>([]);
  const [loginError, setLoginError] = useState<LoginErrorState | null>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleValidation = () => {
    const errors = [];
    if (username == "")
      errors.push("username");

    if (password == "")
      errors.push("password");

    if (errors.length != 0) {
      setInputErrors(errors);
      return;
    }

    login({
      username,
      password
    }).then(token => {
      dispatch(simpleLogin({...jwtDecoder(token), token}));

      me().then(data => {
        dispatch(completeLogin({...data, token}));
        navigate("/");
      })
    }).catch((err: LoginError) => {
      setLoginError(err.state);
    })
  }

  return (
    <>
      <div className={`alert alert-error ${loginError != null ? "show" : "fade"}`}>
        {loginError &&
          <p>
            {loginError == "BAD_CREDENTIALS"
              ? "Identifiants incorrects"
              : "Couple nom d'utilisateur/mot de passe incorrect"}
          </p>
        }
      </div>

      <div className="login-box">
        <h2>Connexion</h2>
        <img src={logo} className="logo" alt="logo"/>

        <div className="input-group">
          <label htmlFor="username">Nom d'utilisateur :</label>
          <input id="username" name="username" type="text" required={true}
                 className={inputErrors.includes("username") ? "error" : ""}
                 onChange={(e) => {
                   setUsername(e.target.value);
                   setLoginError(null);
                 }} value={username}/>
          {inputErrors.includes("username") &&
            <p className="invalid-input">Veuillez spécifier un nom d'utilisateur</p>
          }
        </div>

        <div className="input-group">
          <label htmlFor="password">Mot de passe :</label>
          <input id="password" name="password" type="password" required={true}
                 className={inputErrors.includes("password") ? "error" : ""}
                 onChange={(e) => {
                   setPassword(e.target.value);
                   setLoginError(null);
                 }} value={password}/>
          {inputErrors.includes("password") &&
              <p className="invalid-input">Veuillez spécifier un mot de passe</p>
          }
        </div>

        <button className="button button-validate" onClick={handleValidation}>Valider</button>
      </div>
    </>
  )
}

export default LoginPage;
