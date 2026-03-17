# GigShield AI - Backend

**AI-Powered Parametric Insurance Platform for Gig Workers**

This is the backend service for the GigShield AI platform, built with FastAPI and machine learning models to detect income disruptions and process insurance claims automatically.

## 🚀 Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL 13+
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
```bash
cd backend
```

2. **Create virtual environment**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies**
```bash
pip install -r requirements.txt
```

4. **Setup environment**
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. **Setup Database**

Ensure PostgreSQL is running, then create the database:
```bash
createdb gigshield_db
```

6. **Run migrations** (if using Alembic)
```bash
alembic upgrade head
```

7. **Start the server**
```bash
python run.py
```

The API will be available at `http://localhost:8000`

## 📚 API Documentation

Once the server is running, access the interactive documentation:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🏗️ Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── api/
│   │   ├── routes.py          # API endpoints
│   │   └── __init__.py
│   ├── core/
│   │   ├── config.py          # Configuration
│   │   └── __init__.py
│   ├── database/
│   │   ├── session.py         # Database setup
│   │   └── __init__.py
│   ├── models/
│   │   ├── db.py              # SQLAlchemy ORM models
│   │   └── __init__.py
│   ├── schemas/
│   │   ├── schemas.py         # Pydantic schemas
│   │   └── __init__.py
│   ├── services/
│   │   ├── services.py        # Business logic
│   │   └── __init__.py
│   └── ml/
│       ├── models.py          # XGBoost & Fraud Detection
│       └── __init__.py
├── requirements.txt            # Dependencies
├── run.py                       # Server entry point
├── demo.py                      # Demo workflow
├── .env.example                 # Environment template
└── README.md                    # This file
```

## 🔑 Core Features

### 1. **Risk Assessment Model** (XGBoost)
- Analyzes environmental and operational data
- Generates disruption risk score (0-100%)
- Categorizes risk: LOW | MEDIUM | HIGH

**Inputs:**
- Temperature, Rainfall, AQI, Traffic Index
- Delivery Demand, Active Riders, Order Volume

### 2. **Two-Layer Disruption Trigger**
- **Layer 1**: Environmental threshold checks
- **Layer 2**: Activity verification (confirm delivery drop)
- Both must be satisfied to trigger insurance

### 3. **Fraud Detection** (Isolation Forest)
- Multiple verification checks:
  - Weather data validation
  - GPS location verification
  - Activity pattern analysis
  - Duplicate claim detection
  - Claim frequency analysis

### 4. **Automated Claim Processing**
- Instant claim creation when disruption verified
- Automatic fraud detection
- Zero manual intervention

### 5. **Payment Integration**
- Razorpay integration for instant payouts
- Automatic fund transfer to worker accounts
- Transaction tracking

## 🔗 API Endpoints

### Workers
```
POST   /api/v1/workers                    # Create worker
GET    /api/v1/workers/{worker_id}        # Get worker
GET    /api/v1/workers/user/{user_id}     # Get by user_id
```

### Subscriptions
```
POST   /api/v1/subscriptions              # Create subscription
GET    /api/v1/subscriptions/worker/{id}  # Get active subscription
GET    /api/v1/subscriptions/worker/{id}/coverage  # Check coverage
```

### Risk Assessment
```
POST   /api/v1/risk/assess                # Assess disruption risk
```

### Environmental Data
```
POST   /api/v1/environmental-data         # Record environmental data
GET    /api/v1/environmental-data/{zone}  # Get zone data
```

### Claims
```
POST   /api/v1/claims                     # Create claim
POST   /api/v1/claims/{id}/verify         # Verify claim
GET    /api/v1/claims/{id}                # Get claim
GET    /api/v1/claims/worker/{id}         # List claims
POST   /api/v1/claims/{id}/approve        # Approve claim
```

### Payouts
```
POST   /api/v1/payouts                    # Initiate payout
POST   /api/v1/payouts/{id}/complete      # Complete payout
GET    /api/v1/payouts/{id}               # Get payout
```

## 🧪 Demo Workflow

Run the complete demo showing the entire workflow:

```bash
python demo.py
```

This will:
1. Create a worker and subscription
2. Simulate environmental disruption
3. Trigger risk assessment
4. Create and verify claim
5. Process automatic payout

## 🗄️ Database Models

### Worker
- Stores gig worker information
- Links to subscriptions and claims
- Zone and platform tracking

### Subscription
- Worker's active insurance plan
- Premium tracking
- Coverage period

### Claim
- Insurance claims from workers
- Fraud detection scores
- Status tracking (PENDING → VERIFIED → APPROVED → PAID)

### EnvironmentalData
- Real-time weather and operational metrics
- Zone-specific readings
- Historical tracking

### DisruptionEvent
- Detected disruption occurrences
- Risk scores and triggers
- Event logging

### Payout
- Payment transaction records
- Razorpay integration
- Status tracking

## 🤖 ML Models

### XGBoost Risk Assessment
- **Purpose**: Predict disruption probability
- **Features**: Temperature, rainfall, AQI, traffic, delivery demand
- **Output**: Risk score (0-1)

### Isolation Forest Fraud Detection
- **Purpose**: Detect fraudulent claims
- **Method**: Anomaly detection on claim patterns
- **Output**: Fraud score (0-1)

## 📊 Configuration

Edit `.env` to customize:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost/gigshield_db

# ML Thresholds
DISRUPTION_THRESHOLD=0.65
FRAUD_DETECTION_THRESHOLD=0.75

# Payment
DEFAULT_PAYOUT_AMOUNT=200.0

# Polling intervals
WEATHER_CHECK_INTERVAL_MINUTES=60
DELIVERY_DATA_CHECK_INTERVAL_MINUTES=30
```

## 🔧 Development

### Running Tests
```bash
pytest tests/
```

### Database Migrations (Alembic)
```bash
# Create migration
alembic revision --autogenerate -m "Add new table"

# Apply migration
alembic upgrade head
```

### Code Style
```bash
# Format with Black
black app/

# Lint with Flake8
flake8 app/
```

## 📦 Dependencies

Key packages:
- **fastapi** - Web framework
- **sqlalchemy** - ORM
- **xgboost** - ML model
- **scikit-learn** - ML utilities
- **pandas** - Data processing
- **pydantic** - Data validation
- **psycopg2** - PostgreSQL driver
- **razorpay** - Payment gateway

## 🚀 Running the Application

### Local Development
```bash
# Ensure PostgreSQL is running
python run.py
```

The API will be available at `http://localhost:8000`

### Access Interactive Docs
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 🔒 Security

- Input validation via Pydantic
- SQL injection protection via SQLAlchemy ORM
- CORS configuration for frontend
- Environment-based secret management

## 📝 License

MIT License - See LICENSE file

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit pull request

## 📧 Support

For issues and questions, open an issue on GitHub.

---

**Built with ❤️ for gig workers** 🛡️
