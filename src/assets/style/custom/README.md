# Guide agli Stili Personalizzati - Angular Material 20

Questo folder contiene la documentazione e gli esempi per personalizzare gli stili dei componenti Angular Material 20.

## 📁 File Disponibili

### 1. **MATERIAL-TOKENS-GUIDE.md** ⭐ LEGGI PRIMA
Documentazione completa di tutti i token disponibili per personalizzare form field e input.

**Contenuto:**
- Introduzione al sistema di token
- Elenco completo dei token per forma, colori, tipografia, icone
- Esempi pratici
- Note importanti

**Accedi qui quando:** Devi sapere quale token usare o come combinare più token.

---

### 2. **form-field-tokens-examples.scss**
File SCSS con 10 pattern pronti all'uso e combinazioni comuni.

**Pattern disponibili:**
1. Form field standard arrotondato
2. Form field compatto
3. Form field tema scuro
4. Form field con colori brand
5. Form field per input numerico
6. Form field error styling
7. Form field disabilitato
8. Form field minimale
9. Form field grande
10. Form field multiline/textarea

**Accedi qui quando:** Vuoi copiare un pattern già pronto e personalizzarlo.

---

### 3. **material-components/mat-form-field-input.scss**
File principale di stile dei form field (quello che usiamo nel progetto).

**Contiene:**
- `@include mat.form-field-overrides((...))` - Il mixin principale per personalizzare i token
- `@include mat.form-field-density(-2)` - Impostazione della densità

---

## 🚀 Come Usare

### Scenario 1: Personalizzare i Form Field Globalmente

1. Apri il file `mat-form-field-input.scss`
2. Consulta `MATERIAL-TOKENS-GUIDE.md` per trovare i token che servono
3. Aggiungi i token dentro `@include mat.form-field-overrides(())`

**Esempio:**
```scss
html {
  @include mat.form-field-overrides((
    outlined-container-shape: 28px,
    filled-container-color: colors.$info-color,
  ));
}
```

---

### Scenario 2: Usare un Pattern Pronto

1. Apri `form-field-tokens-examples.scss`
2. Copia il mixin che preferisci (es. `form-field-dark-theme()`)
3. Nel tuo file principale, aggiungi:

```scss
@use './form-field-tokens-examples' as examples;

html {
  @include examples.form-field-dark-theme();
}
```

---

### Scenario 3: Creare un Nuovo Pattern

1. Apri `form-field-tokens-examples.scss`
2. Aggiungi un nuovo `@mixin`:

```scss
@mixin form-field-my-custom-style() {
  @include mat.form-field-overrides((
    // Aggiungi i tuoi token qui
    outlined-container-shape: 16px,
    outlined-outline-color: #9c27b0,
  ));
}
```

3. Usa il mixin nel tuo file principale

---

## 📚 Riferimento Rapido dei Token Più Comuni

| Token | Cosa fa | Esempio |
|-------|---------|---------|
| `outlined-container-shape` | Arrotondamento bordi (outlined) | `28px` |
| `filled-container-shape` | Arrotondamento bordi (filled) | `28px` |
| `outlined-outline-color` | Colore bordo | `#9c27b0` |
| `outlined-focus-outline-color` | Colore bordo al focus | `#9c27b0` |
| `filled-container-color` | Colore sfondo (filled) | `#f5f5f5` |
| `outlined-input-text-color` | Colore testo | `#333333` |
| `outlined-label-text-color` | Colore label | `#666666` |
| `container-height` | Altezza form field | `56px` |
| `container-text-size` | Dimensione testo | `14px` |

👉 **Per la lista completa**: Vedi `MATERIAL-TOKENS-GUIDE.md`

---

## 💡 Tips & Tricks

### ✅ DOs
- ✅ Usa i token della guida - sono testati e officialy supportati
- ✅ Organizza i tuoi pattern in mixin riutilizzabili
- ✅ Testa i cambiamenti su diversi dispositivi
- ✅ Usa variabili dal file `colors.scss` per coerenza

### ❌ DON'Ts
- ❌ Non usare le vecchie variabili CSS (`--mdc-...`)
- ❌ Non modificare `node_modules/@angular/material`
- ❌ Non dimenticare `;` dopo i valori nei token
- ❌ Non confondere `outlined-*` con `filled-*` token

---

## 🔍 Debug

Se i tuoi stili non si applicano:

1. **Assicurati di usare la sintassi corretta:**
   ```scss
   @include mat.form-field-overrides((token: value))
   ```

2. **Verifica il nome del token:**
   - I token sono case-sensitive
   - Guarda su `MATERIAL-TOKENS-GUIDE.md` per i nomi esatti

3. **Controlla il file SCSS:**
   - Il file deve essere importato in `styles.scss`
   - Verifica che non ci siano errori di compilazione

4. **Controlla l'ordine:**
   - Se altri stili override i tuoi, spostali dopo negli import

---

## 📝 Note sulla Migrazione da Angular 19

In Angular 19 usavamo:
```scss
.mdc-text-field--outlined {
  --mdc-outlined-text-field-container-shape: 28px;
}
```

In Angular 20 usiamo:
```scss
html {
  @include mat.form-field-overrides((
    outlined-container-shape: 28px,
  ));
}
```

**Perché?** Il nuovo sistema è più coerente, performante e segue lo standard Material Design 3.

---

## 🔗 Link Utili

- [Angular Material Docs](https://material.angular.io)
- [Material Design 3](https://m3.material.io)
- [Token System Guide](MATERIAL-TOKENS-GUIDE.md)
- [Code Examples](form-field-tokens-examples.scss)

---

## 📅 Manutenzione

**Ultima aggiornamento:** 20 Ottobre 2025
**Versione Material:** 20
**Versione Angular:** 20

---

## ❓ Domande Frequenti

### D: Posso personalizzare i Select component?
**R:** Sì! Usa gli stessi token, ma sono disponibili anche token specifici per `select-arrow-color`, `select-option-text-color`, etc. Vedi la guida completa.

### D: Come applico stili solo a certi form field?
**R:** Puoi creare classi CSS:
```scss
.my-form-field {
  @include examples.form-field-compact();
}
```
Poi aggiungi `class="my-form-field"` al tuo form field.

### D: Posso combinare più pattern?
**R:** Sì, ma attento ai conflitti. Se due mixin impostano lo stesso token, vince l'ultimo.

### D: Dove vanno i token custom?
**R:** Nel file `mat-form-field-input.scss` dentro `@include mat.form-field-overrides(())`.

---

**Buona customizzazione! 🎨**
