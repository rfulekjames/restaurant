function AuthFormWrapper(props) {
  return (
    <div className="container">
      <br />
      <div className="card col-md-6 offset-md-3 offset-md-3">
        <h3 className="text-center">{props.title}</h3>
        <div className="card-body">{props.children}</div>
      </div>
    </div>
  );
}

export default AuthFormWrapper;
