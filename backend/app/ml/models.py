"""
ML Models for GigShield - Risk Assessment and Fraud Detection
"""
import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
import xgboost as xgb
import pickle
import os
from typing import Dict, Tuple, List
from app.core.config import settings


class RiskAssessmentModel:
    """XGBoost model for disruption risk scoring"""
    
    def __init__(self):
        self.model = None
        self.scaler = StandardScaler()
        self.feature_names = [
            'temperature', 'rainfall', 'aqi', 'traffic_index', 
            'delivery_demand', 'zone_encoded'
        ]
        self.is_trained = False
        self.zone_mapping = {}
        
    def train(self, X_train: pd.DataFrame, y_train: pd.Series):
        """Train XGBoost model"""
        
        # Encode zone
        if 'zone' in X_train.columns:
            self.zone_mapping = {zone: i for i, zone in enumerate(X_train['zone'].unique())}
            X_train['zone_encoded'] = X_train['zone'].map(self.zone_mapping)
            X_train = X_train[self.feature_names]
        
        # Scale features
        X_scaled = self.scaler.fit_transform(X_train)
        
        # Train XGBoost
        self.model = xgb.XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            eval_metric='logloss'
        )
        self.model.fit(X_scaled, y_train)
        self.is_trained = True
        
    def predict(self, X: pd.DataFrame) -> Tuple[float, str, List[str]]:
        """
        Predict disruption risk
        Returns: (risk_score, risk_level, triggering_factors)
        """
        if not self.is_trained:
            return self._dummy_predict(X)
        
        # Encode zone
        if 'zone' in X.columns:
            zone = X['zone'].iloc[0] if isinstance(X, pd.DataFrame) else X['zone']
            zone_encoded = self.zone_mapping.get(zone, 0)
            
            if isinstance(X, pd.DataFrame):
                X['zone_encoded'] = zone_encoded
                X = X[self.feature_names]
            else:
                X['zone_encoded'] = zone_encoded
        
        # Scale features
        X_scaled = self.scaler.transform(X)
        
        # Get probability
        risk_score = float(self.model.predict_proba(X_scaled)[0][1])
        
        # Determine risk level
        if risk_score < 0.33:
            risk_level = "LOW"
        elif risk_score < 0.67:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
        
        # Get triggering factors
        triggering_factors = self._get_triggering_factors(X, risk_score)
        
        return risk_score, risk_level, triggering_factors
    
    def _dummy_predict(self, X) -> Tuple[float, str, List[str]]:
        """Dummy prediction when model not trained"""
        # Simple rule-based prediction
        if isinstance(X, dict):
            rainfall = X.get('rainfall', 0)
            temperature = X.get('temperature', 25)
            aqi = X.get('aqi', 50)
            traffic = X.get('traffic_index', 0.5)
            delivery_demand = X.get('delivery_demand', 1.0)
        else:
            rainfall = X['rainfall'].iloc[0] if isinstance(X, pd.DataFrame) else X['rainfall']
            temperature = X['temperature'].iloc[0] if isinstance(X, pd.DataFrame) else X['temperature']
            aqi = X['aqi'].iloc[0] if isinstance(X, pd.DataFrame) else X['aqi']
            traffic = X['traffic_index'].iloc[0] if isinstance(X, pd.DataFrame) else X['traffic_index']
            delivery_demand = X['delivery_demand'].iloc[0] if isinstance(X, pd.DataFrame) else X['delivery_demand']
        
        # Rule-based scoring
        risk_score = 0.0
        factors = []
        
        if rainfall > 80:
            risk_score += 0.3
            factors.append("HIGH_RAINFALL")
        elif rainfall > 50:
            risk_score += 0.15
            
        if temperature > 40 or temperature < 5:
            risk_score += 0.2
            factors.append("EXTREME_TEMPERATURE")
            
        if aqi > 300:
            risk_score += 0.2
            factors.append("SEVERE_AQI")
        elif aqi > 200:
            risk_score += 0.1
            
        if traffic > 0.85:
            risk_score += 0.15
            factors.append("HEAVY_TRAFFIC")
            
        if delivery_demand < 0.6:
            risk_score += 0.2
            factors.append("LOW_DELIVERY_DEMAND")
        
        risk_score = min(1.0, risk_score)
        
        if risk_score < 0.33:
            risk_level = "LOW"
        elif risk_score < 0.67:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"
        
        return risk_score, risk_level, factors
    
    def _get_triggering_factors(self, X, risk_score) -> List[str]:
        """Extract triggering factors from data"""
        factors = []
        
        if isinstance(X, pd.DataFrame):
            rainfall = X['rainfall'].iloc[0]
            temperature = X['temperature'].iloc[0]
            aqi = X['aqi'].iloc[0]
            traffic = X['traffic_index'].iloc[0]
            delivery_demand = X['delivery_demand'].iloc[0]
        else:
            rainfall = X.get('rainfall', 0)
            temperature = X.get('temperature', 25)
            aqi = X.get('aqi', 50)
            traffic = X.get('traffic_index', 0.5)
            delivery_demand = X.get('delivery_demand', 1.0)
        
        if rainfall > 80:
            factors.append("HIGH_RAINFALL")
        if temperature > 40 or temperature < 5:
            factors.append("EXTREME_TEMPERATURE")
        if aqi > 300:
            factors.append("SEVERE_AQI")
        if traffic > 0.85:
            factors.append("HEAVY_TRAFFIC")
        if delivery_demand < 0.6:
            factors.append("LOW_DELIVERY_DEMAND")
        
        return factors if factors else ["UNKNOWN"]
    
    def save(self, filepath: str):
        """Save model to disk"""
        data = {
            'model': self.model,
            'scaler': self.scaler,
            'zone_mapping': self.zone_mapping
        }
        with open(filepath, 'wb') as f:
            pickle.dump(data, f)
    
    def load(self, filepath: str):
        """Load model from disk"""
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                data = pickle.load(f)
            self.model = data['model']
            self.scaler = data['scaler']
            self.zone_mapping = data['zone_mapping']
            self.is_trained = True


class FraudDetectionModel:
    """Isolation Forest based fraud detection"""
    
    def __init__(self, contamination: float = 0.1):
        self.model = None
        self.scaler = StandardScaler()
        self.contamination = contamination
        self.feature_names = [
            'claim_frequency', 'claim_amount_deviation',
            'time_since_subscription', 'activity_consistency'
        ]
        self.is_trained = False
    
    def train(self, X_train: pd.DataFrame, y_train: pd.Series = None):
        """
        Train Isolation Forest
        y_train not required for unsupervised anomaly detection
        """
        # Scale features
        X_scaled = self.scaler.fit_transform(X_train[self.feature_names])
        
        # Train IsolationForest
        self.model = IsolationForest(
            contamination=self.contamination,
            random_state=42,
            n_estimators=100
        )
        self.model.fit(X_scaled)
        self.is_trained = True
    
    def predict(self, claim_data: Dict) -> Tuple[float, bool, Dict]:
        """
        Predict fraud score
        Returns: (fraud_score, is_fraud, fraud_details)
        """
        fraud_details = {}
        
        # Extract claim features
        claim_frequency = claim_data.get('claim_frequency', 0)
        claim_amount_deviation = claim_data.get('claim_amount_deviation', 0)
        time_since_subscription = claim_data.get('time_since_subscription_days', 30)
        activity_consistency = claim_data.get('activity_consistency', 0.8)
        
        # Rule-based fraud checks
        fraud_score = 0.0
        
        # Check 1: Multiple claims in short period
        if claim_frequency > 3:  # More than 3 claims in 30 days
            fraud_score += 0.3
            fraud_details['multiple_claims'] = True
        
        # Check 2: Weather data inconsistency
        if not claim_data.get('weather_verified', True):
            fraud_score += 0.2
            fraud_details['weather_unverified'] = True
        
        # Check 3: GPS location validation
        if not claim_data.get('gps_verified', True):
            fraud_score += 0.25
            fraud_details['location_unverified'] = True
        
        # Check 4: Activity anomaly
        if activity_consistency < 0.4:
            fraud_score += 0.15
            fraud_details['activity_anomaly'] = True
        
        # Check 5: Claim amount deviation
        if claim_amount_deviation > 2.0:  # 2 std dev from mean
            fraud_score += 0.2
            fraud_details['amount_anomaly'] = True
        
        # Check 6: Early subscription claim (within first 3 days)
        if time_since_subscription < 3:
            fraud_score += 0.15
            fraud_details['early_claim'] = True
        
        # Normalize score
        fraud_score = min(1.0, fraud_score)
        
        # Determine if fraudulent
        is_fraud = fraud_score > settings.fraud_detection_threshold
        
        return fraud_score, is_fraud, fraud_details
    
    def save(self, filepath: str):
        """Save model to disk"""
        data = {
            'model': self.model,
            'scaler': self.scaler
        }
        with open(filepath, 'wb') as f:
            pickle.dump(data, f)
    
    def load(self, filepath: str):
        """Load model from disk"""
        if os.path.exists(filepath):
            with open(filepath, 'rb') as f:
                data = pickle.load(f)
            self.model = data['model']
            self.scaler = data['scaler']
            self.is_trained = True


# Singleton instances
risk_model = RiskAssessmentModel()
fraud_model = FraudDetectionModel()
