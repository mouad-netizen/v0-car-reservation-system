-- Insert sample cars
INSERT INTO public.cars (name, brand, model, category, year, daily_price, seats, transmission, fuel_type, image_url, description, available)
VALUES
  ('Peugeot 3008', 'Peugeot', '3008', 'SUV', 2024, 89.99, 5, 'Automatique', 'Hybride', '/cars/peugeot-3008.jpg', 'SUV compact spacieux avec intérieur moderne', true),
  ('Renault Clio', 'Renault', 'Clio', 'Citadine', 2023, 49.99, 5, 'Manuelle', 'Essence', '/cars/renault-clio.jpg', 'Citadine agile et économique', true),
  ('BMW Série 3', 'BMW', '320i', 'Berline', 2024, 129.99, 5, 'Automatique', 'Diesel', '/cars/bmw-serie3.jpg', 'Berline de luxe avec technologie avancée', true),
  ('Mercedes-Benz Classe A', 'Mercedes', 'A 180', 'Berline', 2023, 119.99, 5, 'Automatique', 'Essence', '/cars/mercedes-a.jpg', 'Voiture premium avec design élégant', true),
  ('Tesla Model 3', 'Tesla', 'Model 3', 'Berline', 2024, 139.99, 5, 'Automatique', 'Électrique', '/cars/tesla-model3.jpg', 'Voiture électrique avec autonomie exceptionnelle', true),
  ('Citroën C3', 'Citroën', 'C3', 'Citadine', 2023, 45.99, 5, 'Manuelle', 'Essence', '/cars/citroen-c3.jpg', 'Citadine colorée et pratique', true),
  ('Audi A4', 'Audi', 'A4', 'Berline', 2024, 119.99, 5, 'Automatique', 'Diesel', '/cars/audi-a4.jpg', 'Berline sportive avec conduite dynamique', true),
  ('Volkswagen Golf', 'Volkswagen', 'Golf', 'Berline', 2023, 69.99, 5, 'Manuelle', 'Essence', '/cars/vw-golf.jpg', 'Classique fiable avec excellente maniabilité', true),
  ('Porsche 911', 'Porsche', '911', 'Sport', 2024, 249.99, 2, 'Automatique', 'Essence', '/cars/porsche-911.jpg', 'Voiture de sport légendaire avec performances exceptionnelles', true),
  ('Ford Transit', 'Ford', 'Transit', 'Utilitaire', 2023, 99.99, 3, 'Manuelle', 'Diesel', '/cars/ford-transit.jpg', 'Fourgonnette spacieuse pour le transport', true);
