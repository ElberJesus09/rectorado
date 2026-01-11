// src/components/ExpandableText.tsx (Final)
import React, { useState } from 'react';

interface ExpandableTextProps {
    text: string;
    limit?: number;
}

const ExpandableText: React.FC<ExpandableTextProps> = ({ text, limit = 250 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!text || text.length <= limit) {
        // Se agregó dark:text-white aquí
        return <span className="text-gray-800 dark:text-white break-words align-middle">{text}</span>;
    }

    const truncatedText = text.substring(0, limit).trim() + (text.length > limit ? '...' : '');
    const displayText = isExpanded ? text : truncatedText;

    return (
        <div className="flex flex-col">
            {/* Se agregó dark:text-white aquí */}
            <span className={`text-gray-800 dark:text-white text-sm break-words`}>
                {displayText}
            </span>

            <button
                onClick={() => setIsExpanded(!isExpanded)}
                // Se ajustó el color del botón para mejor visibilidad en ambos modos
                className="self-start mt-1 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold text-xs transition duration-150 underline"
                title={isExpanded ? "Ocultar detalles" : "Mostrar detalles completos"}
            >
                {isExpanded ? 'Ver menos' : 'Ver más'}
            </button>
        </div>
    );
};

export default ExpandableText;