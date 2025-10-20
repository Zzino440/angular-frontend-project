# Angular Material 20 - Guida ai Token di Stile

Questo documento descrive tutti i token disponibili in Angular Material 20 (Material Design 3) per personalizzare i form field e input.

## Introduzione

In Angular Material 20, il sistema di personalizzazione è stato completamente rivisto. Non si usano più le variabili CSS dirette (come `--mdc-outlined-text-field-container-shape`), ma il nuovo sistema di **token SCSS**.

### Sintassi Base

```scss
@use '@angular/material' as mat;

html {
  @include mat.form-field-overrides((
    token-name: value,
    another-token: value,
  ));
}
```

---

## Form Field - Token Disponibili

### 1️⃣ FORMA E DIMENSIONI

#### Forma container (Border Radius)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `outlined-container-shape` | Arrotondamento del form field outlined | `28px`, `4px`, etc. |
| `filled-container-shape` | Arrotondamento del form field filled | `28px`, `4px`, etc. |
| `container-height` | Altezza totale del container | `56px`, `48px`, etc. |

#### Padding e Spaziatura
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `container-vertical-padding` | Padding verticale interno | `8px`, `12px`, etc. |
| `filled-with-label-container-padding-top` | Padding superiore quando c'è label (filled) | `4px`, `8px`, etc. |
| `filled-with-label-container-padding-bottom` | Padding inferiore quando c'è label (filled) | `4px`, `8px`, etc. |

#### Outline (Bordo)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `outlined-outline-width` | Spessore del bordo normale | `1px`, `2px` |
| `outlined-focus-outline-width` | Spessore del bordo al focus | `2px`, `3px` |
| `outlined-disabled-outline-color` | Colore bordo quando disabilitato | `rgba(0,0,0,0.12)` |

---

### 2️⃣ COLORI - FORM FIELD OUTLINED

#### Container (Sfondo)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `outlined-container-color` | Colore sfondo normale | Colore hex/rgba |
| (non esiste) | | |

#### Outline (Bordo)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `outlined-outline-color` | Colore bordo normale | Colore hex/rgba |
| `outlined-hover-outline-color` | Colore bordo al hover | Colore hex/rgba |
| `outlined-focus-outline-color` | Colore bordo al focus | Colore hex/rgba |
| `outlined-error-outline-color` | Colore bordo in stato errore | `#f44336` (rosso) |
| `outlined-error-hover-outline-color` | Colore bordo errore al hover | Colore hex/rgba |
| `outlined-error-focus-outline-color` | Colore bordo errore al focus | Colore hex/rgba |

#### Testo Input
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `outlined-input-text-color` | Colore testo input | Colore hex/rgba |
| `outlined-input-text-placeholder-color` | Colore placeholder | Colore hex/rgba |
| `outlined-disabled-input-text-color` | Colore testo quando disabilitato | Colore hex/rgba |
| `outlined-error-text-color` | Colore testo in stato errore | Colore hex/rgba |

#### Label
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `outlined-label-text-color` | Colore label normale | Colore hex/rgba |
| `outlined-focus-label-text-color` | Colore label al focus | Colore hex/rgba |
| `outlined-hover-label-text-color` | Colore label al hover | Colore hex/rgba |
| `outlined-error-label-text-color` | Colore label in errore | Colore hex/rgba |
| `outlined-error-focus-label-text-color` | Colore label errore al focus | Colore hex/rgba |
| `outlined-error-hover-label-text-color` | Colore label errore al hover | Colore hex/rgba |
| `outlined-disabled-label-text-color` | Colore label quando disabilitato | Colore hex/rgba |

#### Cursor (Caret)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `outlined-caret-color` | Colore del cursore di testo | Colore hex/rgba |
| `outlined-error-caret-color` | Colore cursore in errore | Colore hex/rgba |

---

### 3️⃣ COLORI - FORM FIELD FILLED

#### Container (Sfondo)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `filled-container-color` | Colore sfondo normale | Colore hex/rgba |
| `filled-disabled-container-color` | Colore sfondo quando disabilitato | Colore hex/rgba |
| `filled-error-container-color` | Colore sfondo in errore | Colore hex/rgba |

#### Active Indicator (Underline)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `filled-active-indicator-height` | Altezza underline al focus | `2px`, `3px` |
| `filled-focus-active-indicator-height` | Altezza underline al focus (focus) | `2px`, `3px` |
| `filled-active-indicator-color` | Colore underline normale | Colore hex/rgba |
| `filled-focus-active-indicator-color` | Colore underline al focus | Colore hex/rgba |
| `filled-hover-active-indicator-color` | Colore underline al hover | Colore hex/rgba |
| `filled-error-active-indicator-color` | Colore underline in errore | Colore hex/rgba |
| `filled-error-focus-active-indicator-color` | Colore underline errore al focus | Colore hex/rgba |
| `filled-error-hover-active-indicator-color` | Colore underline errore al hover | Colore hex/rgba |
| `filled-disabled-active-indicator-color` | Colore underline quando disabilitato | Colore hex/rgba |

#### Testo Input
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `filled-input-text-color` | Colore testo input | Colore hex/rgba |
| `filled-input-text-placeholder-color` | Colore placeholder | Colore hex/rgba |
| `filled-disabled-input-text-color` | Colore testo quando disabilitato | Colore hex/rgba |

#### Label
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `filled-label-text-color` | Colore label normale | Colore hex/rgba |
| `filled-focus-label-text-color` | Colore label al focus | Colore hex/rgba |
| `filled-hover-label-text-color` | Colore label al hover | Colore hex/rgba |
| `filled-error-label-text-color` | Colore label in errore | Colore hex/rgba |
| `filled-error-focus-label-text-color` | Colore label errore al focus | Colore hex/rgba |
| `filled-error-hover-label-text-color` | Colore label errore al hover | Colore hex/rgba |
| `filled-disabled-label-text-color` | Colore label quando disabilitato | Colore hex/rgba |
| `filled-label-display` | Mostra/nasconde label | `block`, `none` |

#### Cursor (Caret)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `filled-caret-color` | Colore del cursore di testo | Colore hex/rgba |
| `filled-error-caret-color` | Colore cursore in errore | Colore hex/rgba |

---

### 4️⃣ TIPOGRAFIA

#### Testo Container
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `container-text-font` | Font della label/placeholder | `'Roboto'`, `'Arial'`, etc. |
| `container-text-size` | Dimensione testo | `16px`, `14px`, etc. |
| `container-text-weight` | Peso testo | `400`, `500`, `700` |
| `container-text-line-height` | Altezza linea | `1.5`, `1.2`, etc. |
| `container-text-tracking` | Letter spacing | `0.5px`, `0px`, etc. |

#### Label Outlined
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `outlined-label-text-font` | Font label (outlined) | `'Roboto'`, `'Arial'`, etc. |
| `outlined-label-text-size` | Dimensione label (outlined) | `16px`, `14px` |
| `outlined-label-text-weight` | Peso label (outlined) | `400`, `500`, `700` |
| `outlined-label-text-tracking` | Letter spacing label (outlined) | `0.5px` |
| `outlined-label-text-populated-size` | Dimensione label quando focused | `12px`, `10px` |

#### Label Filled
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `filled-label-text-font` | Font label (filled) | `'Roboto'`, `'Arial'`, etc. |
| `filled-label-text-size` | Dimensione label (filled) | `16px`, `14px` |
| `filled-label-text-weight` | Peso label (filled) | `400`, `500`, `700` |
| `filled-label-text-tracking` | Letter spacing label (filled) | `0.5px` |

#### Subscript (Hint/Error)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `subscript-text-font` | Font per hint e error | `'Roboto'`, `'Arial'`, etc. |
| `subscript-text-size` | Dimensione hint/error | `12px`, `11px` |
| `subscript-text-weight` | Peso hint/error | `400`, `500` |
| `subscript-text-line-height` | Altezza linea hint/error | `1.4` |
| `subscript-text-tracking` | Letter spacing hint/error | `0.4px` |

---

### 5️⃣ ICONE E STATI SPECIALI

#### Icone
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `leading-icon-color` | Colore icona sinistra | Colore hex/rgba |
| `trailing-icon-color` | Colore icona destra | Colore hex/rgba |
| `error-trailing-icon-color` | Colore icona destra in errore | Colore hex/rgba |
| `error-hover-trailing-icon-color` | Colore icona destra errore hover | Colore hex/rgba |
| `error-focus-trailing-icon-color` | Colore icona destra errore focus | Colore hex/rgba |
| `enabled-select-arrow-color` | Colore freccia select | Colore hex/rgba |
| `focus-select-arrow-color` | Colore freccia select al focus | Colore hex/rgba |

#### Icone Disabled
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `disabled-leading-icon-color` | Colore icona sinistra disabilitata | Colore hex/rgba |
| `disabled-trailing-icon-color` | Colore icona destra disabilitata | Colore hex/rgba |
| `disabled-select-arrow-color` | Colore freccia select disabilitata | Colore hex/rgba |

#### Placeholder
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `disabled-input-text-placeholder-color` | Colore placeholder quando disabilitato | Colore hex/rgba |

#### State Layer (Overlay hover/focus)
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `state-layer-color` | Colore overlay stati | Colore hex/rgba |
| `hover-state-layer-opacity` | Opacità overlay al hover | `0.08`, `0.1`, etc. |
| `focus-state-layer-opacity` | Opacità overlay al focus | `0.12`, `0.15`, etc. |

#### Select Specific
| Token | Descrizione | Uso |
|-------|-------------|-----|
| `select-option-text-color` | Colore testo opzioni select | Colore hex/rgba |
| `select-disabled-option-text-color` | Colore testo opzioni disable | Colore hex/rgba |

---

## Esempi Pratici

### Esempio 1: Form field rounded con colori personalizzati

```scss
@use '@angular/material' as mat;
@use "../colors.scss";

html {
  @include mat.form-field-overrides((
    // Forma
    outlined-container-shape: 28px,
    filled-container-shape: 28px,

    // Colori outlined
    outlined-outline-color: colors.$primary-color,
    outlined-focus-outline-color: colors.$accent-color,
    outlined-input-text-color: colors.$text-primary,

    // Colori filled
    filled-container-color: colors.$light-gray,
    filled-active-indicator-color: colors.$primary-color,
  ));
}
```

### Esempio 2: Form field con tema scuro

```scss
@use '@angular/material' as mat;

html {
  @include mat.form-field-overrides((
    outlined-outline-color: rgba(255, 255, 255, 0.3),
    outlined-focus-outline-color: #90caf9,
    outlined-input-text-color: #ffffff,
    outlined-label-text-color: rgba(255, 255, 255, 0.7),
    outlined-input-text-placeholder-color: rgba(255, 255, 255, 0.5),
  ));
}
```

### Esempio 3: Form field compatto con font personalizzato

```scss
@use '@angular/material' as mat;

html {
  @include mat.form-field-overrides((
    container-height: 40px,
    container-vertical-padding: 4px,
    container-text-font: 'Segoe UI',
    container-text-size: 13px,
    outlined-container-shape: 4px,
  ));

  @include mat.form-field-density(-2);
}
```

### Esempio 4: Form field con errore personalizzato

```scss
@use '@angular/material' as mat;

html {
  @include mat.form-field-overrides((
    outlined-error-outline-color: #ef5350,
    outlined-error-focus-outline-color: #f44336,
    outlined-error-label-text-color: #f44336,
    error-trailing-icon-color: #f44336,
    subscript-text-size: 12px,
  ));
}
```

---

## Utility e Variabili Utili

### Densità

Puoi combina `form-field-overrides` con `form-field-density`:

```scss
html {
  @include mat.form-field-overrides((...));

  // Densità: -2 (compatto), -1, 0 (default), 1, 2, etc.
  @include mat.form-field-density(-2);
}
```

### File Colori

Per mantenere coerenza, usa variabili dal file `colors.scss`:

```scss
// Nel file colors.scss
$primary-color: #9c27b0;
$accent-color: #ff4081;
$text-primary: #333333;
$text-secondary: #666666;
$info-color: #2196f3;
$error-color: #f44336;
$light-gray: #f5f5f5;
```

---

## Note Importanti

⚠️ **Attenzione quando modifichi i token:**

1. I token vanno sempre all'interno di `@include mat.form-field-overrides(())`
2. I token sono case-sensitive
3. I colori devono essere in formato valido SCSS (hex, rgb, rgba, variabili)
4. Non tutti i token si applicano a tutti gli stati (es. `filled-*` solo per filled)
5. Alcune combinazioni possono influenzare l'accessibilità (contrast ratio)

---

## Aggiornamenti Futuri

- [ ] Token per Button
- [ ] Token per Card
- [ ] Token per Dialog
- [ ] Token per Snackbar
- [ ] Tema scuro completo
- [ ] Esempio con Material Theming System

---

**Ultima modifica:** 20 Ottobre 2025
**Versione Material:** 20
**Versione Angular:** 20
