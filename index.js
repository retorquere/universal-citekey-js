const CRC32 = require('crc-32');

module.exports = function citekey(reference) {
  let author_name = '';
  const author_fields = [
    'author',
    'collection-editor',
    'composer',
    'container-author',
    'director',
    'editor',
    'editorial-director',
    'illustrator',
    'interviewer',
    'original-author',
    'recipient',
    'reviewed-author',
    'translator'
  ];
  for (const field of author_fields) {
    if (reference[field] && reference[field].length) author_name = reference[field][0].family || reference[field][0].name;
    if (author_name) break;
  }
  if (!author_name) author_name = 'Anonymous';

  let year = undefined;
  const date_fields = [
    'issued',
    'original-date',
    'container',
    'event-date',
    'submitted'
  ];
  for (const field of date_fields) {
    if (reference[field] && reference[field]['date-parts'] && reference[field]['date-parts'][0]) year = reference[field]['date-parts'][0][0]
    if (typeof year !== 'undefined') break;
  }
  year = typeof year === 'undefined' ? '' : ':' + year;

  // citekey base
  const citekey_base = author_name + year;

  // universal citekey: use doi if provided
  if (reference.DOI) return citekey_base + hash('b', 10, reference.DOI);

  // title hash
  let title = '';
  const title_fields = [
    'title',
    'title-short',
    'original-title',
    'reviewed-title'
  ];
  for (const field of title_fields) {
    if (reference[field]) title = reference[field]
    if (title) break;
  }
  title = canonical_string(title, true);
  return citekey_base + hash('t', 4, title);
}

function hash(start, factor, str) {
  const crc = str ? CRC32.bstr(str) : 0;
  const hash1 = start.charCodeAt(0) + Math.floor((crc % (factor*26)) / 26);
  const hash2 = 'a'.charCodeAt(0) + (crc % 26);
  return String.fromCharCode(hash1) + String.fromCharCode(hash2);
}

function canonical_string(input_string, lowercase_flag) {
  // todo: Unicode stringfolding, see http://unicode.org/reports/tr15/ - Canonical Decomposition
  
  var output_string = input_string;
  if (lowercase_flag) output_string = output_string.toLowerCase();

  // todo: characters to remove
  var excluded_characters = "±˙˜´‘’‛“”‟·•!¿¡#∞£¥$%‰&˝¨ˆ¯˘¸˛^~√∫*§◊¬¶†‡≤≥÷:ªº\"\'©®™";

  // todo: characters replaced by space
  var replaced_characters = "°˚+-–—_…,.;ı(){}‹›<>«=≈?|/\\";
  
  // replace whitespace with single spaces
  output_string = output_string.replace(/\s+/,' ');
  
  return output_string;
}
