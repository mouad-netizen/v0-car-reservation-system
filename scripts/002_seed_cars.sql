-- Insert sample cars into the database
INSERT INTO public.cars (name, brand, model, year, category, price_per_day, transmission, fuel, seats, image, available)
VALUES
  ('Peugeot 3008', 'Peugeot', '3008', 2024, 'SUV', 85, 'Automatique', 'Hybride', 5, '/cars/peugeot-3008.jpg', true),
  ('Renault Clio', 'Renault', 'Clio', 2023, 'Citadine', 45, 'Manuelle', 'Essence', 5, '/cars/renault-clio.jpg', true),
  ('BMW Série 3', 'BMW', 'Série 3', 2024, 'Berline', 120, 'Automatique', 'Diesel', 5, '/cars/bmw-serie3.jpg', true),
  ('Mercedes Classe A', 'Mercedes', 'Classe A', 2023, 'Berline', 95, 'Automatique', 'Essence', 5, '/cars/mercedes-a.jpg', true),
  ('Tesla Model 3', 'Tesla', 'Model 3', 2024, 'Berline', 130, 'Automatique', 'Électrique', 5, '/cars/tesla-model3.jpg', true),
  ('Citroën C3', 'Citroën', 'C3', 2023, 'Citadine', 40, 'Manuelle', 'Essence', 5, '/cars/citroen-c3.jpg', true),
  ('Audi A4', 'Audi', 'A4', 2024, 'Berline', 110, 'Automatique', 'Diesel', 5, '/cars/audi-a4.jpg', true),
  ('Volkswagen Golf', 'Volkswagen', 'Golf', 2023, 'Citadine', 55, 'Manuelle', 'Essence', 5, '/cars/vw-golf.jpg', true),
  ('Porsche 911', 'Porsche', '911', 2024, 'Sport', 350, 'Automatique', 'Essence', 2, '/cars/porsche-911.jpg', true),
  ('Ford Transit', 'Ford', 'Transit', 2023, 'Utilitaire', 75, 'Manuelle', 'Diesel', 3, '/cars/ford-transit.jpg', true)
ON CONFLICT DO NOTHING;
