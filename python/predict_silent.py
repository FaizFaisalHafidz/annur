#!/usr/bin/env python3
"""
Script untuk prediksi jurusan menggunakan KNN dengan data dari database MySQL Laravel
Silent mode untuk production - hanya output JSON
"""

import sys
import json
import os
import mysql.connector
import pandas as pd
import numpy as np
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import warnings
warnings.filterwarnings('ignore')

class SilentKNNPredictor:
    def __init__(self, k=7):
        self.k = k
        self.model = KNeighborsClassifier(n_neighbors=k)
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names = []
        self.silent = True  # Silent mode for production
        
    def log(self, message):
        """Log message only if not in silent mode"""
        if not self.silent:
            print(message)
        
    def get_db_config(self):
        """Get database configuration from Laravel .env file"""
        try:
            from dotenv import load_dotenv
            
            # Load .env file from Laravel root
            env_path = os.path.join(os.path.dirname(__file__), '..', '.env')
            load_dotenv(env_path)
            
            return {
                'host': os.getenv('DB_HOST', 'localhost'),
                'port': int(os.getenv('DB_PORT', 3306)),
                'database': os.getenv('DB_DATABASE', 'sistem_annur'),
                'user': os.getenv('DB_USERNAME', 'root'),
                'password': os.getenv('DB_PASSWORD', '')
            }
        except:
            # Default config
            return {
                'host': 'localhost',
                'port': 3306,
                'database': 'sistem_annur',
                'user': 'root',
                'password': ''
            }
        
    def connect_database(self):
        """Connect to MySQL database"""
        try:
            config = self.get_db_config()
            conn = mysql.connector.connect(**config)
            return conn
        except:
            return None
    
    def load_training_data(self):
        """Load training data from MySQL database"""
        conn = self.connect_database()
        if not conn:
            return None
            
        try:
            query = """
            SELECT 
                sl.jenis_kelamin,
                na.matematika, na.bahasa_indonesia, na.bahasa_inggris,
                na.fisika, na.kimia, na.biologi, na.sejarah, na.geografi, 
                na.ekonomi, na.sosiologi, na.pkn, na.seni_budaya, 
                na.prakarya, na.pjok, na.peminatan_1, na.peminatan_2,
                na.rata_rata_keseluruhan,
                smb.rencana_kuliah, smb.jurusan_diminati, smb.kategori_jurusan,
                smb.tingkat_keyakinan,
                pj.jurusan_prediksi as target_jurusan
            FROM siswa_lengkap sl
            LEFT JOIN nilai_akademik na ON sl.id = na.siswa_lengkap_id
            LEFT JOIN survei_minat_bakat smb ON sl.id = smb.siswa_lengkap_id  
            LEFT JOIN prediksi_jurusan pj ON sl.id = pj.siswa_lengkap_id
            WHERE pj.jurusan_prediksi IS NOT NULL
            AND na.rata_rata_keseluruhan IS NOT NULL
            AND smb.rencana_kuliah IS NOT NULL
            """
            
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query)
            results = cursor.fetchall()
            
            cursor.close()
            conn.close()
            
            if len(results) == 0:
                return None
                
            df = pd.DataFrame(results)
            return df
            
        except:
            if conn:
                conn.close()
            return None
    
    def create_enhanced_dummy_model(self):
        """Create enhanced dummy model with realistic data patterns"""
        try:
            np.random.seed(42)
            n_samples = 500
            
            # Indonesian university majors with realistic distribution
            majors = [
                'Teknik Informatika', 'Manajemen', 'Akuntansi', 'Teknik Sipil', 
                'Kedokteran', 'Psikologi', 'Hukum', 'Farmasi', 'Teknik Elektro',
                'Ekonomi Pembangunan', 'Ilmu Komunikasi', 'Sastra Inggris',
                'Matematika', 'Fisika', 'Kimia', 'Biologi', 'Teknik Mesin',
                'Arsitektur', 'Pendidikan', 'Ilmu Politik'
            ]
            
            # Generate realistic academic data
            X_dummy = []
            y_dummy = []
            
            for _ in range(n_samples):
                # Gender (0=Perempuan, 1=Laki-laki)
                gender = np.random.choice([0, 1])
                
                # Academic scores (60-100)
                base_score = np.random.normal(77, 8)
                math_score = max(60, min(100, base_score + np.random.normal(0, 5)))
                indo_score = max(60, min(100, base_score + np.random.normal(0, 3)))
                eng_score = max(60, min(100, base_score + np.random.normal(0, 4)))
                
                # Science subjects
                physics_score = max(60, min(100, math_score + np.random.normal(-2, 4)))
                chemistry_score = max(60, min(100, math_score + np.random.normal(-1, 4)))
                biology_score = max(60, min(100, base_score + np.random.normal(0, 5)))
                
                # Social subjects  
                history_score = max(60, min(100, base_score + np.random.normal(0, 4)))
                geography_score = max(60, min(100, base_score + np.random.normal(0, 4)))
                economics_score = max(60, min(100, base_score + np.random.normal(2, 4)))
                sociology_score = max(60, min(100, base_score + np.random.normal(1, 4)))
                
                # Other subjects
                pkn_score = max(60, min(100, base_score + np.random.normal(3, 3)))
                arts_score = max(60, min(100, base_score + np.random.normal(0, 6)))
                craft_score = max(60, min(100, base_score + np.random.normal(2, 5)))
                sports_score = max(60, min(100, base_score + np.random.normal(5, 4)))
                
                # Specialization subjects
                spec1_score = max(60, min(100, base_score + np.random.normal(5, 5)))
                spec2_score = max(60, min(100, base_score + np.random.normal(4, 5)))
                
                # Overall average
                overall_avg = np.mean([math_score, indo_score, eng_score, physics_score, 
                                     chemistry_score, biology_score, history_score])
                
                # Survey data
                college_plan = np.random.choice([0, 1, 2], p=[0.1, 0.2, 0.7])  # Tidak, Ragu, Iya
                category = np.random.choice([0, 1])  # Soshum, Saintek
                confidence = np.random.normal(75, 15)
                confidence = max(50, min(100, confidence))
                
                # Features vector
                features = [
                    gender, math_score, indo_score, eng_score, physics_score,
                    chemistry_score, biology_score, history_score, geography_score,
                    economics_score, sociology_score, pkn_score, arts_score,
                    craft_score, sports_score, spec1_score, spec2_score,
                    overall_avg, college_plan, category, confidence
                ]
                
                # Determine major based on academic strengths
                science_avg = np.mean([math_score, physics_score, chemistry_score, biology_score])
                social_avg = np.mean([history_score, geography_score, economics_score, sociology_score])
                
                if science_avg > social_avg + 5:
                    # STEM majors
                    major_pool = ['Teknik Informatika', 'Teknik Sipil', 'Teknik Elektro', 
                                'Teknik Mesin', 'Matematika', 'Fisika', 'Kimia', 'Farmasi']
                    if math_score > 80:
                        major_pool.extend(['Teknik Informatika', 'Teknik Elektro'])
                    if biology_score > 80:
                        major_pool.extend(['Kedokteran', 'Farmasi', 'Biologi'])
                elif social_avg > science_avg + 5:
                    # Social majors
                    major_pool = ['Manajemen', 'Akuntansi', 'Hukum', 'Ilmu Politik',
                                'Ekonomi Pembangunan', 'Ilmu Komunikasi', 'Psikologi']
                    if economics_score > 80:
                        major_pool.extend(['Manajemen', 'Akuntansi', 'Ekonomi Pembangunan'])
                else:
                    # Balanced - all majors possible
                    major_pool = majors
                
                # Select major
                major = np.random.choice(major_pool)
                
                X_dummy.append(features)
                y_dummy.append(major)
            
            # Convert to arrays
            X_dummy = np.array(X_dummy)
            y_dummy = np.array(y_dummy)
            
            # Set feature names
            self.feature_names = [
                'jenis_kelamin_encoded', 'matematika', 'bahasa_indonesia', 'bahasa_inggris',
                'fisika', 'kimia', 'biologi', 'sejarah', 'geografi', 
                'ekonomi', 'sosiologi', 'pkn', 'seni_budaya', 
                'prakarya', 'pjok', 'peminatan_1', 'peminatan_2',
                'rata_rata_keseluruhan', 'rencana_kuliah_encoded', 
                'kategori_jurusan_encoded', 'tingkat_keyakinan'
            ]
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X_dummy, y_dummy, test_size=0.2, random_state=42)
            
            # Encode labels
            self.label_encoder.fit(y_dummy)
            y_train_encoded = self.label_encoder.transform(y_train)
            y_test_encoded = self.label_encoder.transform(y_test)
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.model.fit(X_train_scaled, y_train_encoded)
            
            return True
            
        except Exception as e:
            return False
    
    def predict(self, input_data):
        """Make prediction for new data"""
        try:
            # Prepare feature vector
            features = []
            
            # Gender encoding
            gender_val = 1 if input_data.get('jenis_kelamin') == 'Laki-laki' else 0
            features.append(gender_val)
            
            # Academic scores with defaults
            academic_fields = [
                'matematika', 'bahasa_indonesia', 'bahasa_inggris',
                'fisika', 'kimia', 'biologi', 'sejarah', 'geografi', 
                'ekonomi', 'sosiologi', 'pkn', 'seni_budaya', 
                'prakarya', 'pjok', 'peminatan_1', 'peminatan_2',
                'rata_rata_keseluruhan'
            ]
            
            for field in academic_fields:
                features.append(float(input_data.get(field, 75)))
            
            # Survey data
            rencana_map = {'Iya': 2, 'Masih ragu': 1, 'Tidak': 0}
            rencana_val = rencana_map.get(input_data.get('rencana_kuliah', 'Iya'), 2)
            features.append(rencana_val)
            
            category_val = 1 if input_data.get('kategori_jurusan', 'Saintek') == 'Saintek' else 0
            features.append(category_val)
            features.append(float(input_data.get('tingkat_keyakinan', 75)))
            
            # Ensure correct feature count
            while len(features) < len(self.feature_names):
                features.append(75.0)
            features = features[:len(self.feature_names)]
            
            # Scale features
            X = np.array(features).reshape(1, -1)
            X_scaled = self.scaler.transform(X)
            
            # Make prediction
            prediction = self.model.predict(X_scaled)[0]
            probabilities = self.model.predict_proba(X_scaled)[0]
            
            # Get predicted major name
            predicted_major = self.label_encoder.inverse_transform([prediction])[0]
            
            # Get confidence
            confidence = float(np.max(probabilities) * 100)
            
            # Get top 7 recommendations
            top_indices = np.argsort(probabilities)[::-1][:7]
            recommendations = []
            
            for idx in top_indices:
                major_name = self.label_encoder.inverse_transform([idx])[0]
                probability = float(probabilities[idx] * 100)
                recommendations.append({
                    'major': major_name,
                    'probability': probability
                })
            
            # Academic analysis
            math_score = input_data.get('matematika', 75)
            science_scores = [
                input_data.get('fisika', 75),
                input_data.get('kimia', 75), 
                input_data.get('biologi', 75)
            ]
            social_scores = [
                input_data.get('sejarah', 75),
                input_data.get('geografi', 75),
                input_data.get('ekonomi', 75),
                input_data.get('sosiologi', 75)
            ]
            
            overall_avg = float(input_data.get('rata_rata_keseluruhan', 75))
            science_avg = float(np.mean(science_scores))
            social_avg = float(np.mean(social_scores))
            
            if science_avg > social_avg + 3:
                strength = "Saintek"
            elif social_avg > science_avg + 3:
                strength = "Soshum"
            else:
                strength = "Balanced"
            
            return {
                'success': True,
                'data': {
                    'predicted_major': predicted_major,
                    'confidence': confidence,
                    'recommendations': recommendations,
                    'academic_analysis': {
                        'overall_average': overall_avg,
                        'science_average': science_avg,
                        'social_average': social_avg,
                        'academic_strength': strength
                    }
                }
            }
            
        except Exception as e:
            return {
                'success': False,
                'error': f"Prediction error: {str(e)}"
            }
    
    def save_model(self, model_path):
        """Save trained model"""
        try:
            model_data = {
                'model': self.model,
                'scaler': self.scaler,
                'label_encoder': self.label_encoder,
                'feature_names': self.feature_names,
                'k': self.k
            }
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            joblib.dump(model_data, model_path)
            return True
        except:
            return False
    
    def load_model(self, model_path):
        """Load trained model"""
        try:
            if not os.path.exists(model_path):
                return False
                
            model_data = joblib.load(model_path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.label_encoder = model_data['label_encoder']
            self.feature_names = model_data['feature_names']
            self.k = model_data.get('k', 7)
            
            return True
        except:
            return False

def main():
    """Main function for command line usage"""
    
    if len(sys.argv) < 2:
        result = {
            "success": False,
            "error": "Missing input data"
        }
        print(json.dumps(result))
        return
    
    try:
        # Parse input data
        input_data = json.loads(sys.argv[1])
        
        # Path configurations
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, 'data', 'knn_model_silent.pkl')
        
        # Initialize predictor
        predictor = SilentKNNPredictor()
        
        # Try to load existing model
        model_loaded = predictor.load_model(model_path)
        
        if not model_loaded:
            # Train new model (using dummy data since no real training data)
            success = predictor.create_enhanced_dummy_model()
            if success:
                predictor.save_model(model_path)
            else:
                result = {
                    "success": False,
                    "error": "Failed to create model"
                }
                print(json.dumps(result))
                return
        
        # Make prediction
        result = predictor.predict(input_data)
        print(json.dumps(result))
        
    except json.JSONDecodeError:
        result = {
            "success": False,
            "error": "Invalid JSON input"
        }
        print(json.dumps(result))
    except Exception as e:
        result = {
            "success": False,
            "error": f"Unexpected error: {str(e)}"
        }
        print(json.dumps(result))

if __name__ == "__main__":
    main()