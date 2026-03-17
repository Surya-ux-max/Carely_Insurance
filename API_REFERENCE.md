# GigShield AI - API Reference

## Base URL
```
http://localhost:8000/api/v1
```

## Authentication
Current implementation uses no authentication. Production should implement JWT tokens.

---

## 👨‍💼 Workers API

### Create Worker
**POST** `/workers`

Create a new gig worker profile.

**Request:**
```json
{
  "user_id": "worker_001",
  "name": "Raj Kumar",
  "phone": "9876543210",
  "email": "raj@example.com",
  "zone": "Bangalore_North",
  "platform": "Zomato"
}
```

**Response (200):**
```json
{
  "id": 1,
  "user_id": "worker_001",
  "name": "Raj Kumar",
  "phone": "9876543210",
  "email": "raj@example.com",
  "zone": "Bangalore_North",
  "platform": "Zomato",
  "active": true,
  "created_at": "2024-03-17T10:30:00"
}
```

---

### Get Worker by ID
**GET** `/workers/{worker_id}`

Retrieve worker details by ID.

**Response (200):**
```json
{
  "id": 1,
  "user_id": "worker_001",
  "name": "Raj Kumar",
  "active": true,
  ...
}
```

**Response (404):** Worker not found

---

### Get Worker by User ID
**GET** `/workers/user/{user_id}`

Retrieve worker by user_id.

**Response (200):** Same as Get Worker by ID

---

## 🛡️ Subscriptions API

### Create Subscription
**POST** `/subscriptions`

Subscribe a worker to an insurance plan.

**Request:**
```json
{
  "worker_id": 1,
  "plan_id": 3
}
```

**Response (200):**
```json
{
  "id": 1,
  "worker_id": 1,
  "plan_id": 3,
  "status": "ACTIVE",
  "premium_paid": 120.0,
  "activation_date": "2024-03-17T10:30:00",
  "expiry_date": "2024-04-16T10:30:00",
  "created_at": "2024-03-17T10:30:00"
}
```

---

### Get Active Subscription
**GET** `/subscriptions/worker/{worker_id}`

Get the current active subscription for a worker.

**Response (200):** Subscription object

**Response (404):** No active subscription found

---

### Check Insurance Coverage
**GET** `/subscriptions/worker/{worker_id}/coverage`

Check if worker has active insurance coverage.

**Response (200):**
```json
{
  "worker_id": 1,
  "has_active_coverage": true
}
```

---

## 📊 Risk Assessment API

### Assess Zone Risk
**POST** `/risk/assess`

Assess disruption risk for a specific zone.

**Request:**
```json
{
  "zone": "Bangalore_North",
  "temperature": 42,
  "rainfall": 95,
  "aqi": 280,
  "traffic_index": 0.92,
  "delivery_demand": 0.45
}
```

**Response (200):**
```json
{
  "zone": "Bangalore_North",
  "risk_score": 0.78,
  "risk_level": "HIGH",
  "triggered": true,
  "triggering_factors": [
    "HIGH_RAINFALL",
    "EXTREME_TEMPERATURE",
    "LOW_DELIVERY_DEMAND"
  ]
}
```

**Risk Levels:**
- `LOW`: Risk score < 0.33 (No trigger)
- `MEDIUM`: 0.33 ≤ Risk score < 0.67 (May trigger if high)
- `HIGH`: Risk score ≥ 0.67 (Triggers insurance)

---

## 🌍 Environmental Data API

### Record Environmental Data
**POST** `/environmental-data`

Record environmental and operational metrics for a zone.

**Request:**
```json
{
  "zone": "Bangalore_North",
  "temperature": 42,
  "rainfall": 95,
  "aqi": 280,
  "traffic_index": 0.92,
  "delivery_demand": 0.45,
  "active_riders": 250,
  "order_volume": 1200
}
```

**Response (200):**
```json
{
  "id": 1,
  "zone": "Bangalore_North",
  "timestamp": "2024-03-17T10:30:00",
  "temperature": 42,
  "rainfall": 95,
  "aqi": 280,
  "traffic_index": 0.92,
  "delivery_demand": 0.45,
  "active_riders": 250,
  "order_volume": 1200,
  "created_at": "2024-03-17T10:30:00"
}
```

---

### Get Zone Data
**GET** `/environmental-data/{zone}?hours=24`

Retrieve historical environmental data for a zone.

**Query Parameters:**
- `hours` (optional): Number of hours to look back (default: 24)

**Response (200):**
```json
{
  "zone": "Bangalore_North",
  "hours": 24,
  "data_points": 24,
  "data": [
    {
      "timestamp": "2024-03-17T10:30:00",
      "temperature": 38,
      "rainfall": 0,
      "aqi": 120,
      "traffic_index": 0.45,
      "delivery_demand": 1.0
    },
    ...
  ]
}
```

---

## 📋 Claims API

### Create Claim
**POST** `/claims`

Create an insurance claim (requires active subscription).

**Request:**
```json
{
  "worker_id": 1,
  "subscription_id": 1,
  "disruption_event_id": 1,
  "claim_amount": 200.0
}
```

**Response (200):**
```json
{
  "id": 1,
  "worker_id": 1,
  "status": "PENDING",
  "claim_amount": 200.0,
  "fraud_score": 0.0,
  "created_at": "2024-03-17T10:30:00",
  "updated_at": "2024-03-17T10:30:00"
}
```

**Response (403):** Worker does not have active insurance coverage

---

### Verify Claim
**POST** `/claims/{claim_id}/verify`

Run fraud detection on claim.

**Response (200):**
```json
{
  "claim_id": 1,
  "valid": true,
  "fraud_score": 0.35,
  "status": "VERIFIED",
  "fraud_details": {}
}
```

**Fraud Score Interpretation:**
- 0.00 - 0.33: Low fraud risk (✅ Usually approved)
- 0.33 - 0.75: Medium fraud risk (⚠️ Review needed)
- 0.75 - 1.00: High fraud risk (❌ Rejected)

---

### Get Claim Details
**GET** `/claims/{claim_id}`

Retrieve detailed claim information.

**Response (200):**
```json
{
  "id": 1,
  "worker_id": 1,
  "status": "VERIFIED",
  "claim_amount": 200.0,
  "fraud_score": 0.35,
  "estimated_income_loss": 200.0,
  "verification_notes": "Claim verified successfully",
  "fraud_checks": {
    "multiple_claims": false,
    "weather_unverified": false,
    "location_unverified": false,
    "activity_anomaly": false,
    "amount_anomaly": false,
    "early_claim": false
  },
  "created_at": "2024-03-17T10:30:00"
}
```

---

### List Worker Claims
**GET** `/claims/worker/{worker_id}`

Get all claims for a worker.

**Response (200):**
```json
{
  "worker_id": 1,
  "total_claims": 5,
  "claims": [
    {
      "id": 1,
      "status": "PAID",
      "amount": 200.0,
      "created_at": "2024-03-17T10:30:00"
    },
    {
      "id": 2,
      "status": "VERIFIED",
      "amount": 200.0,
      "created_at": "2024-03-16T10:30:00"
    }
  ]
}
```

---

### Approve Claim
**POST** `/claims/{claim_id}/approve`

Approve a verified claim for payout.

**Response (200):**
```json
{
  "claim_id": 1,
  "status": "APPROVED",
  "amount": 200.0,
  "message": "Claim approved for payout"
}
```

---

## 💰 Payouts API

### Initiate Payout
**POST** `/payouts`

Start a payment transfer for an approved claim.

**Request:**
```json
{
  "claim_id": 1,
  "recipient_phone": "9876543210",
  "amount": 200.0
}
```

**Response (200):**
```json
{
  "id": 1,
  "claim_id": 1,
  "amount": 200.0,
  "currency": "INR",
  "payment_status": "INITIATED",
  "razorpay_order_id": null,
  "created_at": "2024-03-17T10:30:00",
  "completed_at": null
}
```

---

### Complete Payout
**POST** `/payouts/{payout_id}/complete?razorpay_transfer_id={transfer_id}`

Mark payout as completed after Razorpay transfer.

**Query Parameters:**
- `razorpay_transfer_id` (required): Razorpay transfer ID

**Response (200):**
```json
{
  "payout_id": 1,
  "status": "COMPLETED",
  "amount": 200.0,
  "completed_at": "2024-03-17T10:31:00"
}
```

---

### Get Payout Details
**GET** `/payouts/{payout_id}`

Retrieve payout information.

**Response (200):**
```json
{
  "id": 1,
  "claim_id": 1,
  "amount": 200.0,
  "currency": "INR",
  "payment_status": "COMPLETED",
  "razorpay_order_id": "order_12345",
  "created_at": "2024-03-17T10:30:00",
  "completed_at": "2024-03-17T10:31:00"
}
```

---

## ✅ Health & Info API

### Health Check
**GET** `/health`

Check API health status.

**Response (200):**
```json
{
  "status": "healthy",
  "service": "GigShield AI"
}
```

---

### Service Information
**GET** `/info`

Get service information and available endpoints.

**Response (200):**
```json
{
  "service": "GigShield AI - Parametric Insurance for Gig Workers",
  "version": "0.1.0",
  "endpoints": {
    "workers": "/api/v1/workers",
    "subscriptions": "/api/v1/subscriptions",
    "risk_assessment": "/api/v1/risk/assess",
    "environmental_data": "/api/v1/environmental-data",
    "claims": "/api/v1/claims",
    "payouts": "/api/v1/payouts"
  }
}
```

---

## 🔢 Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 400 | Bad Request - Invalid input |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 500 | Server Error - Internal error |

---

## 📝 Error Response Format

```json
{
  "detail": "Error description here"
}
```

Example:
```json
{
  "detail": "Worker does not have active insurance coverage"
}
```

---

## 🔄 Complete Workflow Example

### Step 1: Create Worker
```bash
curl -X POST http://localhost:8000/api/v1/workers \
  -H "Content-Type: application/json" \
  -d '{
    "user_id": "gig_001",
    "name": "Raj Kumar",
    "phone": "9876543210",
    "email": "raj@example.com",
    "zone": "Bangalore_North",
    "platform": "Zomato"
  }'
# Response: worker_id = 1
```

### Step 2: Create Subscription
```bash
curl -X POST http://localhost:8000/api/v1/subscriptions \
  -H "Content-Type: application/json" \
  -d '{
    "worker_id": 1,
    "plan_id": 3
  }'
# Response: subscription_id = 1
```

### Step 3: Record Environmental Data
```bash
curl -X POST http://localhost:8000/api/v1/environmental-data \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "Bangalore_North",
    "temperature": 42,
    "rainfall": 95,
    "aqi": 280,
    "traffic_index": 0.92,
    "delivery_demand": 0.45,
    "active_riders": 250,
    "order_volume": 1200
  }'
```

### Step 4: Assess Risk
```bash
curl -X POST http://localhost:8000/api/v1/risk/assess \
  -H "Content-Type: application/json" \
  -d '{
    "zone": "Bangalore_North",
    "temperature": 42,
    "rainfall": 95,
    "aqi": 280,
    "traffic_index": 0.92,
    "delivery_demand": 0.45
  }'
# Response: risk_score = 0.78, triggered = true
```

### Step 5: Create Claim
```bash
curl -X POST http://localhost:8000/api/v1/claims \
  -H "Content-Type: application/json" \
  -d '{
    "worker_id": 1,
    "subscription_id": 1,
    "disruption_event_id": 1,
    "claim_amount": 200.0
  }'
# Response: claim_id = 1
```

### Step 6: Verify Claim
```bash
curl -X POST http://localhost:8000/api/v1/claims/1/verify
# Response: valid = true, fraud_score = 0.35
```

### Step 7: Approve Claim
```bash
curl -X POST http://localhost:8000/api/v1/claims/1/approve
# Response: status = APPROVED
```

### Step 8: Initiate Payout
```bash
curl -X POST http://localhost:8000/api/v1/payouts \
  -H "Content-Type: application/json" \
  -d '{
    "claim_id": 1,
    "recipient_phone": "9876543210",
    "amount": 200.0
  }'
# Response: payout_id = 1
```

### Step 9: Complete Payout
```bash
curl -X POST "http://localhost:8000/api/v1/payouts/1/complete?razorpay_transfer_id=tfr_12345"
# Response: status = COMPLETED
```

---

## 📚 Interactive Documentation

Access the interactive Swagger UI:
```
http://localhost:8000/docs
```

Or ReDoc:
```
http://localhost:8000/redoc
```

---

## 🔑 Plan IDs Reference

| ID | Plan Name | Duration | Premium | Payout |
|----|-----------| ---------|---------|---------|
| 1 | DAILY | 1 day | ₹5 | ₹200 |
| 2 | WEEKLY | 7 days | ₹25 | ₹200 |
| 3 | MONTHLY | 30 days | ₹120 | ₹200 |

---

**For more information, visit:** [QUICKSTART.md](QUICKSTART.md)
