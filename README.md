# Braketime Bikers

A delivery marketplace prototype connecting food vendors, offices/customers, and independent delivery riders.

## Concept

- Vendors and offices post delivery orders (pickup and drop-off details).
- - Riders sign up to carry deliveries. New riders start as "pending" until an admin manually certifies them.
  - - Company bike fleet: riders who don't own a bike can check out a Braketime-owned bike (each with its own Bike ID) once an admin has certified them as able to ride.
    - - Order matching: open orders can be assigned to an available, certified rider.
     
      - ## Status
     
      - This is an early prototype built with plain HTML, CSS, and JavaScript. Data is stored in the browser's localStorage as mock data. There is no real backend, payment processing, or identity-verification integration yet.
     
      - Rider sign-up currently includes a placeholder ID field only. Real ID verification against a national ID system would require integrating a licensed KYC/verification provider, and is intentionally left as a stub (status: pending) for a future iteration.
     
      - ## Running it
     
      - Clone the repo and open index.html directly in a browser. No build step or server is required.
     
      - ## Roadmap ideas
     
      - - Real backend and database
        - - Real rider identity verification via a licensed provider
          - - Payments and rider payouts
            - - Live rider location and order tracking
              - - Native mobile apps
                - 
