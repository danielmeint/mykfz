import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Checkmark } from 'react-checkmark';
import { PayPalButton } from 'react-paypal-button-v2';
import ProcessService from '../services/ProcessService';

export default function PaymentForm({ process, onProcessPaid }) {
    const clientId =
        'ATuI28VIncLCJuX7OGrZeGvMtje-hZnJMvYWnUcr_TF89oEoN0wO0D1oMz3cGq9ShUt-sEZhFXuA2lvN';

    const price = ProcessService.calculatePrice(process);

    const paymentButtons = (
        <PayPalButton
            amount={price}
            // shippingPreference="NO_SHIPPING" // default is "GET_FROM_FILE"
            onSuccess={onProcessPaid}
            options={{
                clientId: clientId,
                currency: 'EUR'
            }}
        />
    );

    const paymentConfirmedMessage = <Checkmark size="xxLarge" />;

    return (
        <React.Fragment>
            <Typography variant="h6" gutterBottom>
                Payment method
            </Typography>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    {process.isPaid ? paymentConfirmedMessage : paymentButtons}
                    <Button
                        style={{
                            opacity: 0,
                            position: 'absolute',
                            bottom: 0,
                            right: 0
                        }}
                        onClick={onProcessPaid}
                    >
                        (Skip Payment)
                    </Button>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}
