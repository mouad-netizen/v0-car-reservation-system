import { Car, Reservation } from "./types"

export const cars: Car[] = [
  {
    id: "1",
    name: "Peugeot 3008",
    brand: "Peugeot",
    model: "3008",
    year: 2024,
    category: "SUV",
    pricePerDay: 85,
    transmission: "Automatique",
    fuel: "Hybride",
    seats: 5,
    image: "/cars/peugeot-3008.jpg",
    available: true,
  },
  {
    id: "2",
    name: "Renault Clio",
    brand: "Renault",
    model: "Clio",
    year: 2023,
    category: "Citadine",
    pricePerDay: 45,
    transmission: "Manuelle",
    fuel: "Essence",
    seats: 5,
    image: "/cars/renault-clio.jpg",
    available: true,
  },
  {
    id: "3",
    name: "BMW Série 3",
    brand: "BMW",
    model: "Série 3",
    year: 2024,
    category: "Berline",
    pricePerDay: 120,
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    image: "/cars/bmw-serie3.jpg",
    available: true,
  },
  {
    id: "4",
    name: "Mercedes Classe A",
    brand: "Mercedes",
    model: "Classe A",
    year: 2023,
    category: "Berline",
    pricePerDay: 95,
    transmission: "Automatique",
    fuel: "Essence",
    seats: 5,
    image: "/cars/mercedes-a.jpg",
    available: true,
  },
  {
    id: "5",
    name: "Tesla Model 3",
    brand: "Tesla",
    model: "Model 3",
    year: 2024,
    category: "Berline",
    pricePerDay: 130,
    transmission: "Automatique",
    fuel: "Électrique",
    seats: 5,
    image: "/cars/tesla-model3.jpg",
    available: true,
  },
  {
    id: "6",
    name: "Citroën C3",
    brand: "Citroën",
    model: "C3",
    year: 2023,
    category: "Citadine",
    pricePerDay: 40,
    transmission: "Manuelle",
    fuel: "Essence",
    seats: 5,
    image: "/cars/citroen-c3.jpg",
    available: true,
  },
  {
    id: "7",
    name: "Audi A4",
    brand: "Audi",
    model: "A4",
    year: 2024,
    category: "Berline",
    pricePerDay: 110,
    transmission: "Automatique",
    fuel: "Diesel",
    seats: 5,
    image: "/cars/audi-a4.jpg",
    available: true,
  },
  {
    id: "8",
    name: "Volkswagen Golf",
    brand: "Volkswagen",
    model: "Golf",
    year: 2023,
    category: "Citadine",
    pricePerDay: 55,
    transmission: "Manuelle",
    fuel: "Essence",
    seats: 5,
    image: "/cars/vw-golf.jpg",
    available: true,
  },
  {
    id: "9",
    name: "Porsche 911",
    brand: "Porsche",
    model: "911",
    year: 2024,
    category: "Sport",
    pricePerDay: 350,
    transmission: "Automatique",
    fuel: "Essence",
    seats: 2,
    image: "/cars/porsche-911.jpg",
    available: true,
  },
  {
    id: "10",
    name: "Ford Transit",
    brand: "Ford",
    model: "Transit",
    year: 2023,
    category: "Utilitaire",
    pricePerDay: 75,
    transmission: "Manuelle",
    fuel: "Diesel",
    seats: 3,
    image: "/cars/ford-transit.jpg",
    available: true,
  },
]

// Generate mock reservations for the dashboard
const generateMockReservations = (): Reservation[] => {
  const statuses: Reservation["status"][] = ["pending", "confirmed", "completed", "cancelled"]
  const firstNames = ["Jean", "Marie", "Pierre", "Sophie", "Lucas", "Emma", "Thomas", "Léa", "Nicolas", "Camille"]
  const lastNames = ["Dupont", "Martin", "Bernard", "Petit", "Robert", "Richard", "Durand", "Moreau", "Simon", "Laurent"]
  
  const reservations: Reservation[] = []
  
  for (let i = 0; i < 25; i++) {
    const car = cars[Math.floor(Math.random() * cars.length)]
    const startDate = new Date()
    startDate.setDate(startDate.getDate() + Math.floor(Math.random() * 60) - 30)
    const endDate = new Date(startDate)
    endDate.setDate(endDate.getDate() + Math.floor(Math.random() * 7) + 1)
    
    const days = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    
    reservations.push({
      id: `RES-${String(i + 1).padStart(4, "0")}`,
      carId: car.id,
      car,
      firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
      lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
      phone: `06${Math.floor(Math.random() * 100000000).toString().padStart(8, "0")}`,
      email: Math.random() > 0.3 ? `client${i + 1}@email.com` : undefined,
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
      totalPrice: days * car.pricePerDay,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }
  
  return reservations.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export const mockReservations = generateMockReservations()
