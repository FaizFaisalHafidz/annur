#!/usr/bin/env python3
"""
Script untuk prediksi jurusan menggunakan KNN dengan data dari database MySQL Laravel
Menggunakan struktur data siswa_lengkap, nilai_akademik, dan survei_minat_bakat
Implementasi algoritma K-Nearest Neighbors untuk prediksi jurusan kuliah
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

class DatabaseKNNPredictor:
    def __init__(self, k=5):
        self.k = k
        self.model = KNeighborsClassifier(n_neighbors=k)
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names = []
        
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
        except Exception as e:
            print(f"Error reading database config: {e}")
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
        except Exception as e:
            print(f"Database connection error: {e}")
            return None
    
    def load_training_data(self):
        """Load training data from MySQL database"""
        conn = self.connect_database()
        if not conn:
            return None
            
        try:
            # Query untuk mengambil data training dari database
            # Kita akan menggunakan data siswa yang sudah ada prediksi manual sebagai training data
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
                print("No training data found in database")
                return None
                
            df = pd.DataFrame(results)
            print(f"Loaded {len(df)} training records from database")
            return df
            
        except Exception as e:
            print(f"Error loading training data: {e}")
            if conn:
                conn.close()
            return None
    
    def preprocess_data(self, df):
        """Preprocess data for training"""
        try:
            # Handle missing values
            df = df.dropna()
            
            # Encode categorical variables
            df['jenis_kelamin_encoded'] = df['jenis_kelamin'].map({'Laki-laki': 1, 'Perempuan': 0})
            df['rencana_kuliah_encoded'] = df['rencana_kuliah'].map({'Iya': 2, 'Masih ragu': 1, 'Tidak': 0})
            df['kategori_jurusan_encoded'] = LabelEncoder().fit_transform(df['kategori_jurusan'].fillna('Unknown'))
            
            # Select features
            feature_cols = [
                'jenis_kelamin_encoded', 'matematika', 'bahasa_indonesia', 'bahasa_inggris',
                'fisika', 'kimia', 'biologi', 'sejarah', 'geografi', 
                'ekonomi', 'sosiologi', 'pkn', 'seni_budaya', 
                'prakarya', 'pjok', 'peminatan_1', 'peminatan_2',
                'rata_rata_keseluruhan', 'rencana_kuliah_encoded', 
                'kategori_jurusan_encoded', 'tingkat_keyakinan'
            ]
            
            # Filter existing columns
            available_cols = [col for col in feature_cols if col in df.columns]
            self.feature_names = available_cols
            
            X = df[available_cols].fillna(0)
            y = df['target_jurusan']
            
            return X, y
            
        except Exception as e:
            print(f"Error preprocessing data: {e}")
            return None, None
    
    def train_model(self):
        """Train KNN model with data from database"""
        try:
            # Load training data
            df = self.load_training_data()
            if df is None or len(df) < 5:
                print("Insufficient training data, using enhanced dummy model")
                return self.create_enhanced_dummy_model()
            
            # Preprocess data
            X, y = self.preprocess_data(df)
            if X is None or len(X) < 5:
                return self.create_dummy_model()
            
            # Encode target labels
            self.label_encoder.fit(y)
            y_encoded = self.label_encoder.transform(y)
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(X, y_encoded, test_size=0.2, random_state=42)
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.model.fit(X_train_scaled, y_train)
            
            # Calculate accuracy
            train_accuracy = self.model.score(X_train_scaled, y_train)
            test_accuracy = self.model.score(X_test_scaled, y_test)
            
            print(f"Model trained successfully!")
            print(f"Training accuracy: {train_accuracy:.2f}")
            print(f"Test accuracy: {test_accuracy:.2f}")
            
            return True
            
        except Exception as e:
            print(f"Error training model: {e}")
            return self.create_dummy_model()
    
    def create_enhanced_dummy_model(self):
        """Create enhanced dummy model based on realistic academic data patterns"""
        try:
            np.random.seed(42)
            n_samples = 200
            
            # Define realistic jurusan options
            majors = [
                'Teknik Informatika', 'Teknik Sipil', 'Teknik Mesin', 'Teknik Elektro',
                'Kedokteran', 'Farmasi', 'Keperawatan', 'Kedokteran Gigi',
                'Manajemen', 'Akuntansi', 'Ekonomi Pembangunan', 'Administrasi Bisnis',
                'Hukum', 'Ilmu Politik', 'Hubungan Internasional', 'Komunikasi',
                'Psikologi', 'Sosiologi', 'Pendidikan', 'Sastra Inggris'
            ]
            
            # Create realistic training data
            data_samples = []
            
            for i in range(n_samples):
                # Random gender
                gender = np.random.choice(['Laki-laki', 'Perempuan'])
                gender_encoded = 1 if gender == 'Laki-laki' else 0
                
                # Generate academic scores with realistic patterns
                base_score = np.random.normal(75, 10)  # Base around 75
                
                # Subject scores with some correlation
                math = max(50, min(100, base_score + np.random.normal(0, 5)))
                physics = max(50, min(100, math + np.random.normal(-5, 8)))
                chemistry = max(50, min(100, math + np.random.normal(-3, 6)))
                biology = max(50, min(100, base_score + np.random.normal(2, 7)))
                
                indonesian = max(50, min(100, base_score + np.random.normal(0, 5)))
                english = max(50, min(100, base_score + np.random.normal(-2, 6)))
                history = max(50, min(100, base_score + np.random.normal(1, 5)))
                geography = max(50, min(100, base_score + np.random.normal(0, 6)))
                economics = max(50, min(100, base_score + np.random.normal(-1, 5)))
                sociology = max(50, min(100, base_score + np.random.normal(1, 5)))
                civic = max(50, min(100, base_score + np.random.normal(0, 4)))
                arts = max(50, min(100, base_score + np.random.normal(3, 8)))
                craft = max(50, min(100, base_score + np.random.normal(2, 6)))
                sports = max(50, min(100, base_score + np.random.normal(5, 10)))
                
                specialization1 = max(50, min(100, base_score + np.random.normal(3, 7)))
                specialization2 = max(50, min(100, base_score + np.random.normal(2, 6)))
                
                average = (math + physics + chemistry + biology + indonesian + english + 
                          history + geography + economics + sociology + civic + arts + 
                          craft + sports + specialization1 + specialization2) / 16
                
                # College plan based on academic performance
                if average >= 80:
                    college_plan = np.random.choice(['Iya', 'Masih ragu'], p=[0.8, 0.2])
                elif average >= 70:
                    college_plan = np.random.choice(['Iya', 'Masih ragu', 'Tidak'], p=[0.6, 0.3, 0.1])
                else:
                    college_plan = np.random.choice(['Iya', 'Masih ragu', 'Tidak'], p=[0.4, 0.4, 0.2])
                
                college_encoded = {'Iya': 2, 'Masih ragu': 1, 'Tidak': 0}[college_plan]
                
                # Category based on strengths
                science_score = (math + physics + chemistry + biology) / 4
                social_score = (history + geography + economics + sociology) / 4
                
                if science_score > social_score + 5:
                    category = 'Saintek'
                elif social_score > science_score + 5:
                    category = 'Soshum'
                else:
                    category = np.random.choice(['Saintek', 'Soshum'])
                
                category_encoded = 1 if category == 'Saintek' else 0
                
                # Confidence level
                confidence = max(30, min(100, np.random.normal(75, 15)))
                
                # Select major based on category and scores
                if category == 'Saintek':
                    if math >= 80 and physics >= 75:
                        major = np.random.choice(['Teknik Informatika', 'Teknik Elektro', 'Teknik Mesin'])
                    elif biology >= 80 and chemistry >= 75:
                        major = np.random.choice(['Kedokteran', 'Farmasi', 'Keperawatan'])
                    else:
                        major = np.random.choice(['Teknik Sipil', 'Kedokteran Gigi', 'Teknik Mesin'])
                else:
                    if economics >= 80:
                        major = np.random.choice(['Manajemen', 'Akuntansi', 'Ekonomi Pembangunan'])
                    elif sociology >= 80 or history >= 80:
                        major = np.random.choice(['Hukum', 'Ilmu Politik', 'Komunikasi'])
                    else:
                        major = np.random.choice(['Psikologi', 'Pendidikan', 'Sastra Inggris'])
                
                # Create feature vector
                features = [
                    gender_encoded, math, indonesian, english, physics, chemistry, biology,
                    history, geography, economics, sociology, civic, arts, craft, sports,
                    specialization1, specialization2, average, college_encoded, 
                    category_encoded, confidence
                ]
                
                data_samples.append((features, major))
            
            # Convert to arrays
            X_dummy = np.array([sample[0] for sample in data_samples])
            y_dummy = np.array([sample[1] for sample in data_samples])
            
            self.feature_names = [
                'jenis_kelamin_encoded', 'matematika', 'bahasa_indonesia', 'bahasa_inggris',
                'fisika', 'kimia', 'biologi', 'sejarah', 'geografi', 
                'ekonomi', 'sosiologi', 'pkn', 'seni_budaya', 
                'prakarya', 'pjok', 'peminatan_1', 'peminatan_2',
                'rata_rata_keseluruhan', 'rencana_kuliah_encoded', 
                'kategori_jurusan_encoded', 'tingkat_keyakinan'
            ]
            
            # Encode labels
            self.label_encoder.fit(y_dummy)
            y_encoded = self.label_encoder.transform(y_dummy)
            
            # Split for validation
            X_train, X_test, y_train, y_test = train_test_split(X_dummy, y_encoded, test_size=0.2, random_state=42)
            
            # Scale features
            X_train_scaled = self.scaler.fit_transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)
            
            # Train model
            self.model.fit(X_train_scaled, y_train)
            
            # Evaluate model
            train_accuracy = self.model.score(X_train_scaled, y_train)
            test_accuracy = self.model.score(X_test_scaled, y_test)
            
            print(f"Enhanced dummy model created successfully!")
            print(f"Training samples: {len(X_train)}")
            print(f"Training accuracy: {train_accuracy:.3f}")
            print(f"Test accuracy: {test_accuracy:.3f}")
            print(f"Available majors: {len(set(y_dummy))}")
            
            return True
            
        except Exception as e:
            print(f"Error creating enhanced dummy model: {e}")
            return False
    
    def predict(self, input_data):
        """Make prediction for new data using KNN algorithm"""
        try:
            print("Processing prediction for input data...")
            
            # Prepare feature vector in exact order as training
            features = []
            
            # 1. Gender encoding
            gender_val = 1 if input_data.get('jenis_kelamin') == 'Laki-laki' else 0
            features.append(gender_val)
            
            # 2-18. Academic scores (17 subjects)
            academic_fields = [
                'matematika', 'bahasa_indonesia', 'bahasa_inggris',
                'fisika', 'kimia', 'biologi', 'sejarah', 'geografi', 
                'ekonomi', 'sosiologi', 'pkn', 'seni_budaya', 
                'prakarya', 'pjok', 'peminatan_1', 'peminatan_2',
                'rata_rata_keseluruhan'
            ]
            
            academic_scores = []
            for field in academic_fields:
                score = float(input_data.get(field, 75))  # Default to 75
                score = max(0, min(100, score))  # Ensure valid range
                academic_scores.append(score)
                features.append(score)
            
            # 19. College plan encoding
            rencana_map = {'Iya': 2, 'Masih ragu': 1, 'Tidak': 0}
            rencana_val = rencana_map.get(input_data.get('rencana_kuliah', 'Iya'), 2)
            features.append(rencana_val)
            
            # 20. Category encoding
            kategori_val = float(input_data.get('kategori_jurusan_encoded', 1))
            features.append(kategori_val)
            
            # 21. Confidence level
            confidence_val = float(input_data.get('tingkat_keyakinan', 80))
            confidence_val = max(0, min(100, confidence_val))  # Ensure valid range
            features.append(confidence_val)
            
            # Ensure we have exactly the right number of features
            expected_features = len(self.feature_names)
            if len(features) != expected_features:
                print(f"Feature count mismatch: got {len(features)}, expected {expected_features}")
                # Pad or trim to match
                while len(features) < expected_features:
                    features.append(75.0)  # Default value
                features = features[:expected_features]
            
            print(f"Feature vector prepared: {len(features)} features")
            
            # Convert to numpy array and reshape
            X = np.array(features, dtype=float).reshape(1, -1)
            
            # Scale features using the same scaler as training
            X_scaled = self.scaler.transform(X)
            
            # Make prediction using KNN
            prediction = self.model.predict(X_scaled)[0]
            probabilities = self.model.predict_proba(X_scaled)[0]
            
            # Get predicted major name
            predicted_major = self.label_encoder.inverse_transform([prediction])[0]
            
            # Calculate confidence (probability of top prediction)
            max_prob = np.max(probabilities)
            confidence = float(max_prob * 100)
            
            # Get all class names
            class_names = self.label_encoder.classes_
            
            # Create recommendations sorted by probability
            recommendations = []
            prob_pairs = list(zip(probabilities, class_names))
            prob_pairs.sort(reverse=True, key=lambda x: x[0])
            
            # Take top 7 recommendations
            for prob, major_name in prob_pairs[:7]:
                recommendations.append({
                    'major': major_name,
                    'probability': float(prob * 100)
                })
            
            # Calculate some additional metrics for better prediction
            avg_score = np.mean(academic_scores[:-1])  # Exclude rata_rata_keseluruhan
            science_subjects = [academic_scores[0], academic_scores[3], academic_scores[4], academic_scores[5]]  # math, physics, chemistry, biology
            social_subjects = [academic_scores[6], academic_scores[7], academic_scores[8], academic_scores[9]]  # history, geography, economics, sociology
            
            science_avg = np.mean(science_subjects)
            social_avg = np.mean(social_subjects)
            
            print(f"Prediction completed: {predicted_major} (confidence: {confidence:.1f}%)")
            print(f"Academic average: {avg_score:.1f}, Science: {science_avg:.1f}, Social: {social_avg:.1f}")
            
            return {
                'success': True,
                'data': {
                    'predicted_major': predicted_major,
                    'confidence': round(confidence, 2),
                    'recommendations': recommendations,
                    'academic_analysis': {
                        'overall_average': round(avg_score, 2),
                        'science_average': round(science_avg, 2),
                        'social_average': round(social_avg, 2),
                        'academic_strength': 'Saintek' if science_avg > social_avg else 'Soshum'
                    }
                }
            }
            
        except Exception as e:
            print(f"Prediction error: {str(e)}")
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
            joblib.dump(model_data, model_path)
            print(f"Model saved to {model_path}")
            return True
        except Exception as e:
            print(f"Error saving model: {e}")
            return False
    
    def load_model(self, model_path):
        """Load trained model"""
        try:
            if not os.path.exists(model_path):
                print(f"Model file not found: {model_path}")
                return False
                
            model_data = joblib.load(model_path)
            self.model = model_data['model']
            self.scaler = model_data['scaler']
            self.label_encoder = model_data['label_encoder']
            self.feature_names = model_data['feature_names']
            self.k = model_data.get('k', 5)
            
            # Silent loading - remove print for JSON output
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

def main():
    """Main function for command line usage"""
    
    if len(sys.argv) < 2:
        result = {
            "success": False,
            "error": "Missing input data. Usage: python predict_db.py '<json_data>'"
        }
        print(json.dumps(result))
        return
    
    try:
        # Parse input data
        input_data = json.loads(sys.argv[1])
        
        # Path configurations
        base_dir = os.path.dirname(__file__)
        model_path = os.path.join(base_dir, 'data', 'knn_model_db.pkl')
        
        # Initialize predictor
        predictor = DatabaseKNNPredictor()
        
        # Try to load existing model
        model_loaded = predictor.load_model(model_path)
        
        if not model_loaded:
            print("Model not found. Training new model...")
            # Train new model
            success = predictor.train_model()
            if success:
                # Save the model
                os.makedirs(os.path.dirname(model_path), exist_ok=True)
                predictor.save_model(model_path)
                print("Model trained and saved successfully")
            else:
                result = {
                    "success": False,
                    "error": "Failed to train model"
                }
                print(json.dumps(result))
                return
        else:
            print("Model loaded successfully")
        
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