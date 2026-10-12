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
