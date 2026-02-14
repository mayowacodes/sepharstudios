let private_env = {};
let public_env = {};
let fix_stack_trace = (error) => error?.stack;
function set_private_env(environment) {
  private_env = environment;
}
function set_public_env(environment) {
  public_env = environment;
}

export { public_env as a, set_public_env as b, fix_stack_trace as f, private_env as p, set_private_env as s };
//# sourceMappingURL=shared-server-BeisX7n9.js.map
