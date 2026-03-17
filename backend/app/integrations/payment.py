"""Razorpay payment integration"""
import razorpay
import logging
from typing import Optional, Dict

logger = logging.getLogger(__name__)


class RazorpayClient:
    """Client for Razorpay payment gateway"""
    
    def __init__(self, key_id: str, key_secret: str):
        """Initialize Razorpay client
        
        Args:
            key_id: Razorpay API Key ID
            key_secret: Razorpay API Key Secret
        """
        self.key_id = key_id
        self.key_secret = key_secret
        if key_id and key_secret:
            self.client = razorpay.Client(auth=(key_id, key_secret))
        else:
            self.client = None
    
    def create_transfer(
        self,
        amount: float,
        recipient_phone: str,
        recipient_account: Optional[str] = None,
        description: str = "Claim Payout",
        notes: Optional[Dict] = None
    ) -> Optional[Dict]:
        """Create a transfer (payout) to recipient
        
        Args:
            amount: Amount in rupees
            recipient_phone: Recipient phone number
            recipient_account: Bank account (optional)
            description: Transfer description
            notes: Additional notes
            
        Returns:
            Transfer response dict or None if failed
        """
        try:
            if not self.client:
                logger.warning("Razorpay not configured, using mock transfer")
                return {
                    "id": f"transfer_{int(amount)}_{recipient_phone}",
                    "amount": int(amount * 100),
                    "currency": "INR",
                    "status": "processed",
                    "description": description
                }
            
            # In production, create contact first, then transfer
            transfer_data = {
                "account": recipient_account or "acc_0000000000001x",
                "amount": int(amount * 100),  # Convert to paise
                "currency": "INR",
                "description": description,
                "notes": notes or {"phone": recipient_phone}
            }
            
            transfer = self.client.transfer.create(**transfer_data)
            logger.info(f"Transfer created: {transfer.get('id')}")
            return transfer
        except Exception as e:
            logger.error(f"Razorpay transfer error: {e}")
            return None
    
    def verify_payment(self, payment_id: str, signature: str, secret: str) -> bool:
        """Verify payment signature
        
        Args:
            payment_id: Razorpay payment ID
            signature: Payment signature
            secret: Webhook secret
            
        Returns:
            True if valid, False otherwise
        """
        try:
            import hmac
            import hashlib
            
            message = f"{payment_id}|{signature}"
            expected_signature = hmac.new(
                secret.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return signature == expected_signature
        except Exception as e:
            logger.error(f"Payment verification error: {e}")
            return False
    
    def get_transfer_status(self, transfer_id: str) -> Optional[Dict]:
        """Get transfer status
        
        Args:
            transfer_id: Razorpay transfer ID
            
        Returns:
            Transfer status dict or None if failed
        """
        try:
            if not self.client:
                return {"id": transfer_id, "status": "processed"}
            
            transfer = self.client.transfer.fetch(transfer_id)
            return transfer
        except Exception as e:
            logger.error(f"Fetch transfer error: {e}")
            return None
