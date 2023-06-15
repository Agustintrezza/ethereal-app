import { useEffect, useState } from "react";

import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../screens/CheckoutForm";
import { loadStripe } from "@stripe/stripe-js";

function Payment() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    fetch("/api/config").then(async (r) => {
      const { publishableKey } = await r.json();
      setStripePromise(loadStripe(publishableKey));
    });
  }, []);

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      body: JSON.stringify({}),
    }).then(async (result) => {
      var { clientSecret } = await result.json();
      setClientSecret(clientSecret);
      // console.log(clientSecret)
    });
  }, []);

  return (
    <>
      <div className="container">

        <div className="contenedor-titulo-pago-stripe">
          <h1 className="titulo-formulario-stripe">Ingresá los datos de tu tarjeta.</h1>
        </div>

        <div className="contenedor-general-formulario-stripe">
           
            
                {clientSecret && stripePromise && (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <CheckoutForm />
                  </Elements>
                )}
        </div>
      
      </div>
      
    </>
  );
}

export default Payment;