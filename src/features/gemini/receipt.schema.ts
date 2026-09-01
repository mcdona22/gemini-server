import { Type, Schema } from '@google/genai';

export const receiptResponseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    merchantName: {
      type: Type.STRING,
      description: 'Name of the restaurant or business.',
    },
    currency: {
      type: Type.STRING,
      description: 'ISO currency symbol or code (e.g. GBP, £, USD, EUR).',
    },
    subtotal: {
      type: Type.NUMBER,
      description: 'Total before service charge or taxes, if printed.',
    },
    serviceCharge: {
      type: Type.NUMBER,
      description: 'Explicit service charge or gratuity amount, if printed.',
    },
    totalAmount: {
      type: Type.NUMBER,
      description: 'Total final bill amount.',
    },
    hasDiscrepancy: {
      type: Type.BOOLEAN,
      description:
        'One or more items could not be resolved or the total doesnt match the items total.',
    },
    discrepancyDescription: {
      type: Type.STRING,
      description: 'Description of any discrepancies encountered.',
    },
    items: {
      type: Type.ARRAY,
      description: 'Line items on the receipt.',
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING, description: 'Description of item.' },
          quantity: { type: Type.INTEGER, description: 'Quantity ordered.' },
          price: {
            type: Type.NUMBER,
            description: 'Total price for this line item.',
          },
          hasDiscrepancy: {
            type: Type.BOOLEAN,
            description:
              'One or more attributes could not be resolved accurately.',
          },
        },
        required: ['name', 'price', 'quantity', 'hasDiscrepancy'],
      },
    },
  },
  required: [
    'merchantName',
    'totalAmount',
    'items',
    'serviceCharge',
    'hasDiscrepancy',
    'discrepancyDescription',
  ],
};