/**
 * The hero record block (docs/brief.md, section 6.2): four NACHA-style records,
 * 94 characters each, whitespace preserved. Also used by the Open Graph image.
 */
export interface RecordLine {
  /** NACHA record type code: 1 file header, 5 batch header, 6 entry detail, 9 control. */
  type: '1' | '5' | '6' | '9';
  text: string;
  /** Fields that carry the brand underline in the resting state. */
  fields: string[];
}

export interface Segment {
  text: string;
  field?: 'underline' | 'balanced';
}

export const records: RecordLine[] = [
  {
    type: '1',
    text: '101 ASANTE JOSEPH KOFI     SENIOR SOFTWARE ENGINEER   TECHNICAL LEAD                  ACCRA GH',
    fields: ['ASANTE JOSEPH KOFI', 'SENIOR SOFTWARE ENGINEER', 'ACCRA GH'],
  },
  {
    type: '5',
    text: '520 CSHARP DOTNET          PAYMENTS BUDGETING TAX REGULATORY                      US GH ECOWAS',
    fields: [],
  },
  {
    type: '6',
    text: '622 AVAILABILITY           REMOTE OR RELOCATION                                          UK EU',
    fields: [],
  },
  {
    type: '9',
    text: '900 ENTRIES 0000004        DEBITS 000000000000  CREDITS 000000000000                  BALANCED',
    fields: ['BALANCED'],
  },
];

/** Split a record into plain text and field segments, checking the NACHA width. */
export function segments(record: RecordLine): Segment[] {
  if (record.text.length !== 94) {
    throw new Error(`Record ${record.type} is ${record.text.length} characters; NACHA records are 94.`);
  }
  const result: Segment[] = [];
  let cursor = 0;
  for (const field of record.fields) {
    const start = record.text.indexOf(field, cursor);
    if (start < 0) throw new Error(`Field "${field}" not found in record ${record.type}.`);
    if (start > cursor) result.push({ text: record.text.slice(cursor, start) });
    result.push({ text: field, field: field === 'BALANCED' ? 'balanced' : 'underline' });
    cursor = start + field.length;
  }
  if (cursor < record.text.length) result.push({ text: record.text.slice(cursor) });
  return result;
}
