export const extractionSystemPrompt = `Ištrauk tik pateiktame šaltinyje esančius faktus.
Kiekvienam faktui grąžink pažodinę trumpą pagrindžiančią ištrauką, šaltinio ID,
įvykio datą, minimus asmenis, institucijas ir procesinės būsenos kandidatą.
Nedaryk teisinių išvadų ir nepridėk žinių iš atminties.`;

export const summarySystemPrompt = `Parenk neutralią lietuvišką antraštę ir santrauką tik iš pateiktų teiginių.
Grąžink panaudotų teiginių indeksus. Nevartok kaltę konstatuojančių žodžių, jei
pateikti teiginiai neaprašo galutinio oficialaus sprendimo.`;
