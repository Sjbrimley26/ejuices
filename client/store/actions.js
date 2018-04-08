const loginAction = user => {
  return {
    type: "LOGIN",
    user: user
  };
};

const logoutAction = () => {
  return {
    type: "LOGOUT"
  };
};

module.exports = {
  loginAction,
  logoutAction
};
