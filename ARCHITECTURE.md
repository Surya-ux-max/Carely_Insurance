# GigShield AI - Architecture & Design

## 🏗️ System Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client Layer                              │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐             │
│  │   Workers   │  │   Admin     │  │  Platform    │             │
│  │  Dashboard  │  │   Portal    │  │   Systems    │             │
│  └─────────────┘  └─────────────┘  └──────────────┘             │
└────────────────────────┬─────────────────────────────────────────┘
                         │  REST API (HTTP/JSON)
┌────────────────────────▼─────────────────────────────────────────┐
│                      API Gateway Layer                           │
│                    (FastAPI Framework)                           │
└────────────────────────┬─────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
┌───────▼────────┐ ┌────▼────────┐ ┌────▼─────────┐
│  Route Handlers │  │ Validation  │  │ Middleware  │
│  (/api/v1/...)  │  │  (Pydantic) │  │   (CORS)    │
└───────┬────────┘ └────────────┘ └────────────────┘
        │
┌───────▼──────────────────────────────────────────────────────────┐
│                   Business Logic Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ WorkerServ.  │  │ ClaimServ.   │  │ PayoutServ.  │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │ SubsServ.    │  │ RiskAssess.  │  │ EnvDataServ. │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└───────┬──────────────────────────────────────────────────────────┘
        │
        ├─────────────┬─────────────┬─────────────┐
        │             │             │             │
┌───────▼───────┐ ┌──▼─────────┐ ┌▼───────────┐  │
│  ML Pipeline  │ │ ORM Layer   │ │  Utilities │  │
├───────────────┤ ├─────────────┤ └────────────┘  │
│ • XGBoost     │ │ SQLAlchemy  │                 │
│ • IsoForest   │ │  Models     │                 │
│ • Fraud Detec │ │             │                 │
└───────┬───────┘ └──┬──────────┘                 │
        │             │                           │
        │         ┌───▼───────────────────────────┘
        │         │
┌───────▼─────────▼───────────────────────────────┐
│              Data Persistence Layer             │
│  ┌──────────────────┐  ┌────────────────────┐  │
│  │  PostgreSQL DB   │  │  Redis Cache       │  │
│  │  (Primary Data)  │  │  (Sessions/Cache)  │  │
│  └──────────────────┘  └────────────────────┘  │
└───────────────────────────────────────────────────┘
```

## 📊 Data Flow

### End-to-End Insurance Claim Flow

```
1. WORKER SUBSCRIBES
   └─→ Worker Profile Created
       └─→ Subscription Active
           └─→ Coverage Verified

2. ENVIRONMENTAL MONITORING (Continuous)
   └─→ Weather Data Collected
   └─→ Delivery Metrics Collected
   └─→ Data Stored in DB

3. DISRUPTION DETECTION
   └─→ Environmental Data → XGBoost Model
       └─→ Risk Score Calculated (0-1)
           └─→ Compared to Threshold
               └─→ Disruption Event Created

4. CLAIM TRIGGER
   └─→ Risk Score > Threshold?
       └─→ YES → Automatic Claim Created
           └─→ Claim Status: PENDING

5. FRAUD DETECTION
   └─→ Isolation Forest Analysis
       └─→ 6-Layer Verification:
           ├─ Weather validation
           ├─ GPS location check
           ├─ Activity analysis
           ├─ Claim frequency
           ├─ Amount deviation
           └─ Pattern matching
       └─→ Fraud Score Calculated
           └─→ Claim Status: VERIFIED/REJECTED

6. APPROVAL & PAYOUT
   └─→ Claim Verified?
       └─→ YES → Claim Status: APPROVED
           └─→ Payout Initiated
               └─→ Razorpay Transfer
                   └─→ Funds to Worker Account
                       └─→ Payout Status: COMPLETED

7. WORKER RECEIVES FUNDS
   └─→ Income Protection Activated
       └─→ Financial Security Provided
```

## 🗂️ Database Schema

### Relationships

```
InsurancePlan (1) ─────→ (M) Subscription
                                    │
                                    ├─→ (1) Worker
                                    │        │
                                    │        ├─→ (M) Claim
                                    │                  │
                                    │                  ├─→ (M) Payout
                                    │                  └─→ (1) DisruptionEvent

EnvironmentalData ─→ ZoneThreshold (per zone)
                          │
                    ┌─────┴──────┐
                    ▼            ▼
            RiskAssessment  DisruptionEvent
                              │
                              └─→ Claim
```

### Entity Details

**Worker**
- id, user_id (unique)
- name, phone, email
- zone, platform, active
- created_at, updated_at

**InsurancePlan**
- id, name (DAILY/WEEKLY/MONTHLY)
- duration_days, premium_amount, payout_amount
- active, created_at

**Subscription**
- id, worker_id (FK), plan_id (FK)
- status, premium_paid
- activation_date, expiry_date

**EnvironmentalData**
- id, zone, timestamp
- temperature, rainfall, aqi, traffic_index
- delivery_demand, active_riders, order_volume

**ZoneThreshold**
- id, zone (unique)
- temperature_threshold, rainfall_threshold
- aqi_threshold, traffic_threshold
- delivery_drop_threshold

**DisruptionEvent**
- id, zone, event_timestamp
- risk_score, risk_level (enum)
- environmental_trigger, activity_verification
- triggered_by, environmental_data (JSON)

**Claim**
- id, worker_id (FK), subscription_id (FK)
- disruption_event_id (FK)
- status (PENDING/VERIFIED/APPROVED/REJECTED/PAID)
- claim_amount, estimated_income_loss
- fraud_score, fraud_checks (JSON)
- verified_by, verification_notes

**Payout**
- id, claim_id (FK)
- amount, currency, payment_status
- razorpay_transfer_id, razorpay_order_id
- recipient_phone, recipient_account

## 🤖 ML Pipeline

### 1. Risk Assessment (XGBoost)

```
INPUT:
  - temperature: 42°C
  - rainfall: 95mm
  - aqi: 280
  - traffic_index: 0.92
  - delivery_demand: 0.45
  + historical zone data

PROCESSING:
  - Feature scaling (StandardScaler)
  - Zone encoding
  - XGBoost prediction
  - Probability calculation

OUTPUT:
  - risk_score: 0.78 (78%)
  - risk_level: "HIGH"
  - triggering_factors: ["HIGH_RAINFALL", ...]
  - triggered: bool
```

**Model Features:**
- Algorithm: XGBoost Classifier
- Trees: 100
- Max Depth: 6
- Learning Rate: 0.1
- Subsample: 0.8

**Performance:**
- Training: ~1000 samples
- Inference: <50ms per request
- Accuracy: Depends on training data

### 2. Fraud Detection (Isolation Forest)

```
INPUT:
  - claim_frequency: 2 (in 30 days)
  - claim_amount_deviation: 0.5 σ
  - time_since_subscription: 25 days
  - activity_consistency: 0.85
  - weather_verified: True
  - gps_verified: True

CHECKS:
  1. Frequency: >3 claims → +0.3 fraud score
  2. Weather: Unverified → +0.2
  3. GPS: Unverified → +0.25
  4. Activity: <0.4 consistency → +0.15
  5. Amount: >2σ deviation → +0.2
  6. Early: <3 days old → +0.15

OUTPUT:
  - fraud_score: 0.35 (35%)
  - is_fraud: False
  - fraud_details: {...}
```

**Model Details:**
- Algorithm: Isolation Forest
- Contamination: 0.1 (10%)
- Estimators: 100
- Threshold: 0.75 (75%)

## 📡 API Routing

### Request Flow

```
Request (HTTP)
    │
    ├─→ FastAPI Router
    │    │
    │    ├─→ Route Handler
    │    │    │
    │    │    ├─→ Pydantic Validation
    │    │    │
    │    │    ├─→ Service Method Call
    │    │    │    │
    │    │    │    ├─→ Business Logic
    │    │    │    │    │
    │    │    │    │    ├─→ ML Model (if needed)
    │    │    │    │    │
    │    │    │    │    └─→ Database Query
    │    │    │    │        (SQLAlchemy ORM)
    │    │    │    │
    │    │    │    └─→ Response Object
    │    │    │
    │    │    └─→ Pydantic Schema
    │    │
    │    └─→ Response (JSON)
    │
    └─→ Client
```

## 🔄 Async Processing (Future)

```
Synchronous (Current):
Request → Processing → Response

Asynchronous (Planned):
Request → Queue (Redis) → Worker Process → Callback
    ↓
Response (Async)
    ↓
WebSocket Notification to Client
```

Using:
- Background Task: Celery + Redis
- Monitoring: ML model updates
- Notification: Real-time alerts

## 🌐 Scalability Architecture

### Horizontal Scaling

```
Load Balancer (Nginx)
    │
    ├─→ API Instance 1 (Port 8001)
    ├─→ API Instance 2 (Port 8002)
    ├─→ API Instance 3 (Port 8003)
    └─→ API Instance N
        │
        └─→ Shared PostgreSQL
        └─→ Shared Redis Cache
```

### Vertical Scaling

```
Single Instance
    │
    ├─→ API Server (Python)
    ├─→ ML Worker Pool
    ├─→ Database Connection Pool
    └─→ Cache Layer
```

## 🔐 Security Architecture

```
Client Request
    │
    ├─→ HTTPS/TLS
    │
    ├─→ Input Validation (Pydantic)
    │
    ├─→ SQL Injection Prevention (ORM)
    │
    ├─→ CORS Validation
    │
    ├─→ Authentication (Token-based)
    │
    ├─→ Rate Limiting
    │
    └─→ Output Encoding (JSON)
```

## 📈 Performance Optimizations

### Database
- Indexed columns: user_id, zone, worker_id, created_at
- Connection pooling: 20 connections, max 40
- Query optimization: Only select needed fields

### ML Models
- Model caching: In-memory
- Batch prediction: Supported
- Fast inference: <50ms per request

### API
- Response compression: Gzip
- Lazy loading: On-demand data
- Pagination: Supported

## 🚀 Deployment Architecture

### Development
```
Local Machine
    ↓
Python Process + SQLite
```

### Staging
```
Single Server
    ├─→ FastAPI (Gunicorn, 4 workers)
    ├─→ PostgreSQL
    └─→ Redis
```

### Production
```
Cloud (AWS/GCP/Azure)
    ├─→ Load Balancer
    ├─→ API Servers (Auto-scaling)
    ├─→ Database (Managed Service)
    ├─→ Cache (Redis Cluster)
    ├─→ ML Model Server
    └─→ Monitoring & Logging
```

## 📊 Monitoring & Logging

```
Application
    ├─→ Structured Logging (JSON)
    │    └─→ ELK Stack (Elastic, Logstash, Kibana)
    │
    ├─→ Metrics (Prometheus)
    │    └─→ Grafana Dashboards
    │
    ├─→ Tracing (Jaeger)
    │    └─→ Distributed tracing
    │
    └─→ Alerting (AlertManager)
         └─→ Email/Slack Notifications
```

## 🎯 Design Principles

1. **Separation of Concerns**: Layers are independent
2. **DRY (Don't Repeat Yourself)**: Reusable services
3. **SOLID Principles**: Single responsibility
4. **Stateless Design**: Easy to scale
5. **Fail-Safe**: Graceful error handling
6. **Security First**: Input/output validation
7. **Performance**: Indexed queries, caching
8. **Maintainability**: Clean code, documentation

---

**Architecture designed for scale, reliability, and performance** 🚀
