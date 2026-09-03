import { Schema, Type } from '@google/genai';
import Ajv from 'ajv';
import * as receiptContractData from './receipt-contract.json' with { type: 'json' };

export const receiptContract =
  (receiptContractData as any).default || receiptContractData;
const ajv = new (Ajv as any)({ allErrors: true });
export const validateReceiptContract = ajv.compile(receiptContract);

function convertToJsonSchemaType(typeStr?: string): Type {
  if (!typeStr) return Type.OBJECT;
  switch (typeStr.toLowerCase()) {
    case 'string':
      return Type.STRING;
    case 'number':
      return Type.NUMBER;
    case 'integer':
      return Type.INTEGER;
    case 'boolean':
      return Type.BOOLEAN;
    case 'array':
      return Type.ARRAY;
    case 'object':
      return Type.OBJECT;
    default:
      return Type.OBJECT;
  }
}

function mapJsonSchemaToGeminiSchema(rawSchema: Record<string, any>): Schema {
  const schema: Schema = {
    type: convertToJsonSchemaType(rawSchema?.type),
    description: rawSchema.description,
  };

  if (rawSchema.properties) {
    schema.properties = {};
    for (const [k, v] of Object.entries<Record<string, any>>(
      rawSchema.properties,
    )) {
      schema.properties[k] = mapJsonSchemaToGeminiSchema(v);
    }
  }

  if (rawSchema.items) {
    schema.items = mapJsonSchemaToGeminiSchema(rawSchema.items);
  }

  if (Array.isArray(rawSchema?.required)) {
    schema.required = rawSchema.required;
  }

  return schema;
}

export const receiptResponseSchema: Schema =
  mapJsonSchemaToGeminiSchema(receiptContract);

// console.log(JSON.stringify(receiptResponseSchema), null, 2);

// export const receiptResponseSchema: Schema = {
//   type: Type.OBJECT,
//   properties: {
//     merchantName: {
//       type: Type.STRING,
//       description: 'Name of the restaurant or business.',
//     },
//     currency: {
//       type: Type.STRING,
//       description: 'ISO currency symbol or code (e.g. GBP, £, USD, EUR).',
//     },
//     subtotal: {
//       type: Type.NUMBER,
//       description: 'Total before service charge or taxes, if printed.',
//     },
//     serviceCharge: {
//       type: Type.NUMBER,
//       description: 'Explicit service charge or gratuity amount, if printed.',
//     },
//     totalAmount: {
//       type: Type.NUMBER,
//       description: 'Total final bill amount.',
//     },
//     hasDiscrepancy: {
//       type: Type.BOOLEAN,
//       description:
//         'One or more items could not be resolved or the total doesnt match the items total.',
//     },
//     discrepancyDescription: {
//       type: Type.STRING,
//       description: 'Description of any discrepancies encountered.',
//     },
//     items: {
//       type: Type.ARRAY,
//       description: 'Line items on the receipt.',
//       items: {
//         type: Type.OBJECT,
//         properties: {
//           name: { type: Type.STRING, description: 'Description of item.' },
//           quantity: { type: Type.INTEGER, description: 'Quantity ordered.' },
//           price: {
//             type: Type.NUMBER,
//             description: 'Total price for this line item.',
//           },
//           hasDiscrepancy: {
//             type: Type.BOOLEAN,
//             description:
//               'One or more attributes could not be resolved accurately.',
//           },
//         },
//         required: ['name', 'price', 'quantity', 'hasDiscrepancy'],
//       },
//     },
//   },
//   required: [
//     'merchantName',
//     'totalAmount',
//     'items',
//     'serviceCharge',
//     'hasDiscrepancy',
//     'discrepancyDescription',
//   ],
// };
