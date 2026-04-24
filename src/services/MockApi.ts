export interface VehicleDetails {
  registration: string;
  make: string;
  model: string;
  variant: string;
  fuelType: string;
  manufactureYear: string;
  city: string;
  rto: string;
}

export const MockApi = {
  lookupVehicle: async (regNumber: string): Promise<VehicleDetails> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation: fail if less than 6 chars
        if (regNumber.length < 6) {
          reject(new Error("Vehicle details not found"));
          return;
        }
        resolve({
          registration: regNumber.toUpperCase(),
          make: "Maruti",
          model: "Swift",
          variant: "VXi",
          fuelType: "Petrol",
          manufactureYear: "2020",
          city: "Delhi",
          rto: regNumber.substring(0, 4).toUpperCase() || "DL09"
        });
      }, 1500); // simulate 1.5s delay
    });
  },

  generateQuoteRange: async (vehicle: Partial<VehicleDetails>, policy: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          min: 7200,
          max: 9800,
          confidence: "High",
          basis: {
            vehicle: `${vehicle.make} ${vehicle.model} ${vehicle.variant}`,
            fuelType: vehicle.fuelType,
            city: vehicle.city,
            year: vehicle.manufactureYear,
            ncb: policy.ncb,
            claims: policy.claims,
            coverPreference: policy.valuePreference
          },
          plans: [
            { name: "Budget Plan", price: 7200 },
            { name: "Balanced Plan", price: 8450 },
            { name: "Max Cover", price: 9800 }
          ]
        });
      }, 1000);
    });
  },

  getExactQuotes: async (personalDetails: any, policy: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: "p1", insurer: "HDFC Ergo", price: 7850, coverType: "Lowest price", idv: 450000, addons: ["Basic Cover"] },
          { id: "p2", insurer: "ICICI Lombard", price: 8450, coverType: "Balanced cover", idv: 480000, addons: ["Basic Cover", "24x7 Support"] },
          { id: "p3", insurer: "Tata AIG", price: 9100, coverType: "Strong claim support", idv: 500000, addons: ["Basic Cover", "Premium Support", "Quick Settlement"] },
        ]);
      }, 1500);
    });
  }
};
