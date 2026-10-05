# Mechanical Test

Tested locally at `http://localhost:3000` with invented report text and the existing simulated mockup image.

## Tests Performed

- Empty submission was rejected with an inline message and no receipt.
- A 1,001-character value was rejected by the submit handler with the 1,000-character limit message.
- Valid reports were accepted for Mensaje, Captura, URL, and Número.
- Each accepted report showed a simulated ID, the initial `Reportado` status, and all three safe-guidance instructions.
- Starting the review changed status to `En revisión`; the analysis and review gate were visibly labeled `Simulado`.
- `Patrón confirmado` was unavailable before the human-review step. Both human-selected outcomes, `Patrón confirmado` and `Evidencia insuficiente`, were tested.
- Invalid phone-number text was rejected; a valid phone number was accepted.
- A tracked-text scan found no common API-key or token patterns. Only invented test text and the simulated mockup were used; no real personal data was submitted.

## Bug Found And Fixed

With `URL` selected, entering `esto no es una URL` previously generated a report receipt. The submission handler only checked whether evidence was empty and within the length limit; it did not validate URL format.

The handler now parses URLs and accepts only `http:` or `https:` addresses. It also validates that Número evidence contains 7–18 digits and only phone-number characters.

## Retest Result

After the fix, the invalid URL was rejected with an inline error and no receipt. A valid `https://` URL and valid phone number were accepted. The remaining mechanical tests above passed.