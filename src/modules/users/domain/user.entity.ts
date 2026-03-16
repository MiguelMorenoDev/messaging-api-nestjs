export class User {
    constructor(
        public readonly id: number,
        public readonly firstName: string,
        public readonly lastName: string,
        public readonly email: string,
        private password: string,
        public isActive: boolean,
        public refreshToken: string | null = null,
    ) {}


//Reglas de negocio

//Ver si un usuario está activo
isEnabled(): boolean {
    return this.isActive;
}

//Limpiar refresh token al hacer logut
clearRefreshToken(): User {
    return new User(
        this.id,
        this.firstName,
        this.lastName,
        this.email,
        this.password,
        this.isActive,
        null,
    );
}

//Guardamos el refreshtoken cuando hacemos login
withRefreshToken(token: string): User {
    return new User(
      this.id,
      this.firstName,
      this.lastName,
      this.email,
      this.password,
      this.isActive,
      token
    );
}

//Acceso a Auth para que pueda compararla con bcrypt, ya que es privada la contraseña
  getPasswordHash(): string {
      return this.password;
  }

}   


