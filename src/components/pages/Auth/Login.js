import React from "react";
import { URL } from "../../../variables";
import { connect } from "react-redux";
import { login, mudarDados } from "../../../components/actions/AppActions";
import { Box, Button, TextField, ThemeProvider, Typography } from "@mui/material";
import Theme from '../../routes/Theme/Theme';

// mui icons
// import login_image from "../../../assets/login_image.svg";
import Navbar from "../Navbar";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      msgErro: "",
      email: "comprador@email.com",
      password: "123456",
      redirect: false,
      path: "",
      loading_save: false,
      hide_password: true,
    };
  }

  async login(e) {
    e.preventDefault();
    console.log("state", this.state);
    this.setState({ loading_save: true, msgErro: "" });
    fetch(`${URL}api/auth/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        // 'Authorization': `Bearer ${this.props.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
      }),
    })
      .then(async (responseLog) => {
        try {
          let resp = await responseLog.json();
          console.log("json", resp);
          console.log(resp.errors);
          if (resp.errors.length != 0) {
            let errors = Object.values(resp.errors);
            let erro = "";
            for (let i = 0; i < errors.length; i++) {
              if (i != errors.length - 1) erro += errors[i] + "\n";
              else erro += errors[i];
            }
            console.log(erro);

            this.setState({
              loading: false,
              msgErro: erro,
              refresh: false,
              loadingMore: false,
              loading_save: false,
            });
          } else {
            // login sucesso
            this.setState({ loading_save: false });

            localStorage.setItem("token", resp.access_token);
            localStorage.setItem("user", JSON.stringify(resp.user));
            localStorage.setItem("breshop", JSON.stringify(resp.user.breshop));

            this.props.login({ token: resp.access_token, user: resp.user });
            this.props.mudarDados({ breshop: resp.user.breshop });
          }
        } catch (err) {
          console.log(err);
          this.setState({
            loading: false,
            msgErro: "Erro ao pegar resposta do servidor",
            refresh: false,
            loadingMore: false,
            loading_save: false,
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({
          loading: false,
          msgErro:
            "Erro ao pegar resposta do servidor. Você está conectado a internet?",
          refresh: false,
          loadingMore: false,
          loading_save: false,
        });
      });
  }

  componentDidMount() {
    this.get_data()
    // const {
    //   match: { params },
    // } = this.props;

    // console.log(this.props);
    let current_token = localStorage.getItem("token");
    console.log("current_token,", current_token);

    if (current_token != null) {
      console.log("ta logado. redirecionado");
      // return <Redirect to='/home' />
    }
  }

  get_data() {
    fetch(`${URL}api/get_all_products?page=1`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(async (response) => {
      let resp = await response.json()
      console.log('resp', resp)
    })
  }

  changeEmail(event) {
    let text = event.target.value;
    let final_num = "";
    final_num = text;
    this.setState({ email: final_num });
  }

  changePassword(event) {
    this.setState({ password: event.target.value });
  }

  // foca o input da div
  focusInput(e) {
    e.currentTarget.lastChild.focus();
  }

  render() {
    return (
      <ThemeProvider theme={Theme}>
        <Navbar />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            background: "rgb(240, 244, 247)",
          }}
        >

          <Typography
            variant="h5"
            sx={{
              fontFamily: "var(--Raleway)",
              margin: "auto 0",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Para prosseguir, faça login com seu e-mail e senha.
          </Typography>

          <Box
            sx={{
              display: "flex",
              margin: "auto",
              marginTop: "2rem",
              borderRadius: "1rem",
              overflow: "hidden",
              boxShadow: { xs: "none", md: "0 1rem 2rem rgba(0, 0, 0, 0.1)" },
              flexWrap: { xs: "wrap", md: "nowrap" },
              flexDirection: { xs: "column-reverse", md: "row-reverse" },
            }}
          >
            <Box
              sx={{
                backgroundColor: "var(--purple)",
                padding: "4rem",
                color: "white",
                gap: "1rem",
                display: "flex",
                flexDirection: "column",
                width: { xs: "100%!important", md: "max-content" },
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img
                // src={ }
                alt="Imagem de login"
                style={{ objectFit: "contain", width: "10rem" }}
              />

              <Typography
                variant="body1"
                sx={{
                  fontFamily: "var(--Raleway)",
                  color: "rgb(210, 210, 210)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: { xs: "center", md: "flex-start" },
                }}
              >
                Se você não tem uma conta,{" "}
                <a
                  className="normal-archor white"
                  href={"/signup"}
                  style={{ display: "inline" }}
                >
                  clique aqui para criar uma.
                </a>
              </Typography>
            </Box>

            <Box
              sx={{
                backgroundColor: "white",
                padding: "4rem",
                width: { xs: "100%!important", md: "max-content" },
              }}
            >
              <form
                style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
              >
                <div className="row">
                  <TextField
                    type="text"
                    placeholder="E-mail"
                    className="my-3"
                    label="E-mail"
                    value={this.state.email}
                    onChange={(e) =>
                      this.setState({ ...this.state, email: e.target.value })
                    }
                    error={this.state.msgErro}
                  />

                  <TextField
                    type={this.state.hide_password ? "password" : "text"}
                    placeholder="Senha"
                    className="my-3"
                    label="Senha"
                    value={this.state.password}
                    onChange={(e) =>
                      this.setState({ ...this.state, password: e.target.value })
                    }
                    error={this.state.msgErro}
                  />
                </div>

                <div className="row">
                  {this.state.msgErro && (
                    <Typography>{this.state.msgErro}</Typography>
                  )}
                  <Typography
                    variant="body1"
                    sx={{ fontFamily: "var(--Raleway)" }}
                  >
                    Se você esqueceu sua senha,{" "}
                    <a className="normal-archor purple" href={"/forgot-password"}>
                      clique aqui.
                    </a>
                  </Typography>
                  <Button onClick={this.login.bind(this)} variant="contained">
                    Entrar
                  </Button>
                </div>
              </form>
            </Box>
          </Box>
        </div>
      </ThemeProvider>
    );
  }
}

const mapsStateToProps = (state) => ({
  token: state.AppReducer.token,
});

export default connect(mapsStateToProps, { login, mudarDados })(Login);
