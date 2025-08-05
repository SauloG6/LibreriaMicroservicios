# Guía de Testing - Librería Microservicios

## Descripción General
Esta guía cubre las estrategias y herramientas de testing para el sistema de microservicios de la librería.

## Estrategia de Testing

### Pirámide de Testing
1. **Unit Tests (70%)** - Pruebas de funciones individuales
2. **Integration Tests (20%)** - Pruebas de integración entre componentes
3. **End-to-End Tests (10%)** - Pruebas completas del sistema

### Tipos de Testing Implementados
- **Unit Testing**: Jest + Testing Library
- **Integration Testing**: Supertest + Test Database
- **API Testing**: Postman Collections
- **Performance Testing**: Artillery
- **Security Testing**: npm audit + OWASP ZAP

## Auth Service Testing

### Configuración
```bash
cd microservices/auth-service
npm install
npm test
```

### Unit Tests
Ubicación: `src/**/*.spec.ts`

**Ejemplo de test unitario:**
```javascript
// src/auth/auth.service.spec.ts
describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('validateUser', () => {
    it('should return user data when credentials are valid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 12),
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'password');

      expect(result).toEqual({
        id: '1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      });
    });

    it('should return null when password is invalid', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: await bcrypt.hash('password', 12),
        firstName: 'Test',
        lastName: 'User',
        role: UserRole.USER,
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);

      const result = await service.validateUser('test@example.com', 'wrongpassword');

      expect(result).toBeNull();
    });
  });
});
```

### Integration Tests
```javascript
// test/auth.e2e-spec.ts
describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    connection = moduleFixture.get<Connection>(Connection);
  });

  afterAll(async () => {
    await connection.close();
    await app.close();
  });

  beforeEach(async () => {
    // Limpiar base de datos de test
    await connection.synchronize(true);
  });

  describe('/auth/register (POST)', () => {
    it('should register a new user', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body.email).toBe('test@example.com');
          expect(res.body.password).toBeUndefined();
        });
    });

    it('should return 400 for invalid email', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'invalid-email',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        })
        .expect(400);
    });
  });

  describe('/auth/login (POST)', () => {
    beforeEach(async () => {
      // Crear usuario de prueba
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({
          email: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User',
        });
    });

    it('should login with valid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res) => {
          expect(res.body.access_token).toBeDefined();
          expect(res.body.user.email).toBe('test@example.com');
        });
    });

    it('should return 401 for invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });
  });
});
```

## Frontend Testing

### Configuración
```bash
cd frontend
npm install
npm test
```

### Testing con React Testing Library
```javascript
// __tests__/login.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthProvider } from '../src/contexts/AuthContext';
import Login from '../src/pages/auth/login';

const MockedLogin = () => (
  <AuthProvider>
    <Login />
  </AuthProvider>
);

describe('Login Page', () => {
  it('should render login form', () => {
    render(<MockedLogin />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('should show validation errors for empty fields', async () => {
    render(<MockedLogin />);
    
    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('should submit form with valid data', async () => {
    const mockLogin = jest.fn();
    
    render(<MockedLogin />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });
});
```

## API Testing con Postman

### Colección de Postman
Crear archivo `postman/LibreriaMicroservicios.postman_collection.json`:

```json
{
  "info": {
    "name": "Librería Microservicios",
    "description": "API Testing Collection",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3001",
      "type": "string"
    },
    {
      "key": "accessToken",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"{{$randomEmail}}\",\n  \"password\": \"password123\",\n  \"firstName\": \"{{$randomFirstName}}\",\n  \"lastName\": \"{{$randomLastName}}\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "register"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 201\", function () {",
                  "    pm.response.to.have.status(201);",
                  "});",
                  "",
                  "pm.test(\"Response has user data\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.expect(jsonData).to.have.property('email');",
                  "    pm.expect(jsonData).to.not.have.property('password');",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"admin@libreria.com\",\n  \"password\": \"admin123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Response has tokens\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('access_token');",
                  "    pm.expect(jsonData).to.have.property('user');",
                  "    ",
                  "    // Guardar token para siguientes requests",
                  "    pm.collectionVariables.set('accessToken', jsonData.access_token);",
                  "});"
                ]
              }
            }
          ]
        },
        {
          "name": "Profile",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{accessToken}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/auth/profile",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "profile"]
            }
          },
          "event": [
            {
              "listen": "test",
              "script": {
                "exec": [
                  "pm.test(\"Status code is 200\", function () {",
                  "    pm.response.to.have.status(200);",
                  "});",
                  "",
                  "pm.test(\"Response has user profile\", function () {",
                  "    const jsonData = pm.response.json();",
                  "    pm.expect(jsonData).to.have.property('id');",
                  "    pm.expect(jsonData).to.have.property('email');",
                  "    pm.expect(jsonData).to.have.property('role');",
                  "});"
                ]
              }
            }
          ]
        }
      ]
    }
  ]
}
```

### Ejecutar Tests con Newman
```bash
# Instalar Newman
npm install -g newman

# Ejecutar colección
newman run postman/LibreriaMicroservicios.postman_collection.json \
  --environment postman/development.postman_environment.json \
  --reporters cli,json \
  --reporter-json-export results.json
```

## Performance Testing

### Configuración de Artillery
Crear `performance/auth-service.yml`:

```yaml
config:
  target: 'http://localhost:3001'
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 20
      name: "Load test"
    - duration: 60
      arrivalRate: 50
      name: "Stress test"
  processor: "./auth-processor.js"

scenarios:
  - name: "Auth flow"
    weight: 70
    flow:
      - post:
          url: "/auth/register"
          json:
            email: "{{ $randomEmail() }}"
            password: "password123"
            firstName: "{{ $randomFirstName() }}"
            lastName: "{{ $randomLastName() }}"
          capture:
            - json: "$.id"
              as: "userId"
      - post:
          url: "/auth/login"
          json:
            email: "{{ email }}"
            password: "password123"
          capture:
            - json: "$.access_token"
              as: "token"
      - get:
          url: "/auth/profile"
          headers:
            Authorization: "Bearer {{ token }}"

  - name: "Health check"
    weight: 30
    flow:
      - get:
          url: "/health"
```

### Ejecutar Performance Tests
```bash
# Instalar Artillery
npm install -g artillery

# Ejecutar test
artillery run performance/auth-service.yml

# Generar reporte HTML
artillery run --output report.json performance/auth-service.yml
artillery report report.json
```

## Security Testing

### Configuración de npm audit
```bash
# Auditoría de seguridad
npm audit

# Arreglar vulnerabilidades automáticamente
npm audit fix

# Forzar arreglos (cuidado en producción)
npm audit fix --force
```

### OWASP ZAP Testing
```bash
# Ejecutar ZAP en modo daemon
docker run -t owasp/zap2docker-stable zap-baseline.py \
  -t http://localhost:3001 \
  -J zap-report.json
```

## Test Data Management

### Fixtures
Crear `test/fixtures/users.json`:

```json
{
  "admin": {
    "email": "admin@libreria.com",
    "password": "admin123",
    "firstName": "Admin",
    "lastName": "User",
    "role": "ADMIN"
  },
  "user": {
    "email": "user@libreria.com",
    "password": "user123",
    "firstName": "Regular",
    "lastName": "User",
    "role": "USER"
  }
}
```

### Test Helpers
```javascript
// test/helpers/test-helpers.ts
export class TestHelpers {
  static async createTestUser(app: INestApplication, userData: any) {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userData)
      .expect(201);
  }

  static async loginUser(app: INestApplication, credentials: any) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send(credentials)
      .expect(200);
    
    return response.body.access_token;
  }

  static getAuthHeaders(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
}
```

## Cobertura de Testing

### Configuración Jest
```json
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/**/*.spec.{ts,js}',
    '!src/**/*.interface.{ts,js}',
    '!src/main.ts'
  ]
};
```

### Reportes de Cobertura
```bash
# Generar reporte de cobertura
npm run test:cov

# Ver reporte HTML
open coverage/lcov-report/index.html
```

## CI/CD Testing

### GitHub Actions Testing
```yaml
# En .github/workflows/ci-cd.yml
test:
  runs-on: ubuntu-latest
  steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run unit tests
      run: npm test
    
    - name: Run integration tests
      run: npm run test:e2e
    
    - name: Run security audit
      run: npm audit
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
```

## Comandos de Testing

### Auth Service
```bash
# Tests unitarios
npm test

# Tests con watch mode
npm run test:watch

# Tests de integración
npm run test:e2e

# Cobertura
npm run test:cov

# Todos los tests
npm run test:all
```

### Frontend
```bash
# Tests unitarios
npm test

# Tests con cobertura
npm run test:coverage

# Tests E2E con Cypress
npm run test:e2e
```

### Docker Testing
```bash
# Ejecutar tests en contenedor
docker-compose exec auth-service npm test

# Tests de integración con base de datos
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## Mejores Prácticas

### 1. Nomenclatura
- Tests unitarios: `*.spec.ts`
- Tests de integración: `*.e2e-spec.ts`
- Tests de componentes: `*.test.tsx`

### 2. Estructura
```
test/
├── fixtures/           # Datos de prueba
├── helpers/           # Utilidades de testing
├── mocks/             # Mocks y stubs
├── integration/       # Tests de integración
└── e2e/              # Tests end-to-end
```

### 3. Principios
- **AAA Pattern**: Arrange, Act, Assert
- **Given-When-Then**: Estructura clara de tests
- **Test Isolation**: Cada test debe ser independiente
- **Fast Feedback**: Tests rápidos y confiables
- **Descriptive Names**: Nombres claros y descriptivos

### 4. Coverage Goals
- **Unit Tests**: 90%+ coverage
- **Integration Tests**: Casos críticos cubiertos
- **E2E Tests**: Flujos principales cubiertos
