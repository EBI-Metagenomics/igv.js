export const COG_MAP = {
    // https://gka.github.io/palettes/#/23|s|1d4097,a8a8a8,87352f|ffaff9,908300,17439b|0|0
    'A': '#1d4097', // RNA processing and modification
    'B': '#36539a', // Chromatin Structure and dynamics
    'C': '#50669d', // Energy production and conversion
    'D': '#6979a0', // Cell cycle control and mitosis
    'E': '#828ca3', // Amino Acid metabolis and transport
    'F': '#9b9fa6', // Nucleotide metabolism and transport
    'G': '#a59e9d', // Carbohydrate metabolism and transport
    'H': '#9f8987', // Coenzyme metabolis
    'I': '#997471', // Lipid metabolism
    'J': '#935f5b', // Tranlsation
    'K': '#8d4a45', // Transcription
    'L': '#87352f', // Replication and repair
    'M': '#eba7cc', // Cell wall/membrane/envelop biogenesis
    'N': '#d79f9e', // Cell motility
    'O': '#c29771', // Post-translational modification, protein turnover, chaperone functions
    'P': '#ae8f44', // Inorganic ion transport and metabolism
    'Q': '#9a8717', // Secondary Structure
    'T': '#937a03', // Signal Transduction
    'U': '#9a690a', // Intracellular trafficing and secretion
    'Y': '#a15711', // Nuclear structure
    'Z': '#a84617', // Cytoskeleton
    'S': '#af341e', // Function Unknown
    'R': '#b62325', // General Functional Prediction only
}

const ANTISMASH_MAP_GC = {
    // https://gka.github.io/palettes/#/58|d|00429d,96ffea,ffffe0|ffffe0,ff005e,93003a|1|1
    'acyl_amino_acids': '#00429d',
    'amglyccycl': '#1448a0',
    'aminocoumarin': '#204fa3',
    'arylpolyene': '#2955a6',
    'bacteriocin': '#315ca9',
    'betalactone': '#3862ac',
    'blactam': '#3f69af',
    'bottromycin': '#466fb2',
    'butyrolactone': '#4c76b5',
    'CDPS': '#527db7',
    'cyanobactin': '#5884ba',
    'ectoine': '#5e8abd',
    'fatty_acid': '#6491c0',
    'fungal-RiPP': '#6a98c2',
    'furan': '#709fc5',
    'fused': '#76a6c8',
    'glycocin': '#7cadca',
    'halogenated': '#83b4cd',
    'head_to_tail': '#89bbcf',
    'hglE-KS': '#90c2d2',
    'hserlactone': '#97c9d4',
    'indole': '#9fd0d6',
    'ladderane': '#a7d6d8',
    'lanthipeptide': '#afddda',
    'LAP': '#b8e4dc',
    'lassopeptide': '#c2eade',
    'linaridin': '#ccf1e0',
    'lipolanthine': '#d9f7e1',
    'melanin': '#e8fce1',
    'microviridin': '#fff6d9',
    'NAGGN': '#ffedd2',
    'nrps-like': '#ffe4cc',
    'nrps': '#ffdbc5',
    'nucleoside': '#ffd2be',
    'oligosaccharide': '#ffc8b7',
    'other': '#ffbfb0',
    'PBDE': '#ffb5a9',
    'phenazine': '#ffaba3',
    'phosphoglycolipid': '#ffa19c',
    'phosphonate': '#fe9795',
    'PKS-like': '#fc8e8e',
    'PpyS-KS': '#f98588',
    'proteusin': '#f67c82',
    'PUFA': '#f2737d',
    'RaS-RiPP': '#ee6a77',
    'resorcinol': '#e96171',
    'saccharide': '#e4586c',
    'sactipeptide': '#df4f66',
    'siderophore': '#da4661',
    'T1PKS': '#d43d5c',
    'T2PKS': '#cd3457',
    'T3PKS': '#c62b53',
    'terpene': '#bf234e',
    'thioamide-NRP': '#b71a4a',
    'thiopeptide': '#af1145',
    'transAT-PKS': '#9d023e',
    'tropodithietic-acid': '#93003a'
}

const ANTISMASH_MAP_GK = {
    'biosynthetic': '#810e15',
    'biosynthetic-additional': '#f16d75',
    'transport': '#6495ED',
    'regulatory': '#2E8B57',
    'resis': '#ed90ed',
    'other': '#BEBEBE',
}

export const ANTISMASH_MAP_GK_LABELS = {
    'Core biosynthetic genes': '#810e15',
    'Additional biosynthetic genes': '#f16d75',
    'Transport-related genes': '#6495ED',
    'Regulatory genes': '#2E8B57',
    'Resistance genes': '#ed90ed',
    'Other genes': '#BEBEBE',
}

/**
 * Get the colour for the COG cateogry.
 * If the category is not mapped then use the R, this also
 * applies if the suplied category is not found (for example: multiles COG categories)
 */
export function getCOGColour(cog) {
    return COG_MAP[cog] || COG_MAP['R'];
}

/**
 * Get the colour for the antiSMASH gene_kind.
*/
export function getAntiSMASHColour(kind) {
    return ANTISMASH_MAP_GK[kind] || ANTISMASH_MAP_GK['other'];
}

export const COLOUR_PRESENCE = '#ff726e';
export const COLOUR_ABSENCE = '#000096';