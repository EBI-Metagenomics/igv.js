const COG_MAP = {
    // Colour blind safe: https://gka.github.io/palettes/#/23|s|1d4097,a8a8a8,87352f|ffaff9,908300,17439b|0|0
    'A': '#1d4097', // RNA processing and modification
    'B': '#294a99', // Chromatin Structure and dynamics
    'C': '#36539a', // Energy production and conversion
    'D': '#435c9c', // Cell cycle control and mitosis
    'E': '#4f669d', // Amino Acid metabolis and transport
    'F': '#5c6f9f', // Nucleotide metabolism and transport
    'G': '#6979a0', // Carbohydrate metabolism and transport
    'H': '#7582a2', // Coenzyme metabolis
    'I': '#828ba3', // Lipid metabolism
    'J': '#8e95a5', // Tranlsation
    'K': '#9b9ea6', // Transcription
    'L': '#a8a8a8', // Replication and repair
    'M': '#a59d9d', // Cell wall/membrane/envelop biogenesis
    'N': '#a29392', // Cell motility
    'O': '#9f8987', // Post-translational modification, protein turnover, chaperone functions
    'P': '#9c7e7c', // Inorganic ion transport and metabolism
    'Q': '#997471', // Secondary Structure
    'T': '#966966', // Signal Transduction
    'U': '#935f5b', // Intracellular trafficing and secretion
    'Y': '#905550', // Nuclear structure
    'Z': '#8d4a45', // Cytoskeleton
    'S': '#8a403a', // Function Unknown
    'R': '#87352f', // General Functional Prediction only
}

/**
 * Get the colour for the COG cateogry.
 * If the category is not mapped then use the R, this also
 * applies if the suplied category is not found (for example: multiles COG categories)
 */
export function getCOGcolour(cog) {
    return COG_MAP[cog] || COG_MAP['R'];
}

export const DEFAULT_COLOR = '#ff726e'; 
export const COLOR_ABSENCE = '#000096';