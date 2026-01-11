import React, { useEffect, useState } from "react";
import type { SheetRow } from "../services/useGoogleSheetService";
import { useSheetService } from "../services/GoogleSheetProvider";
import DataTable from "./DataTable";
import AddDocument from "./AddDocument";
import type { NewDocumentData } from "./AddDocument";

const List: React.FC = () => {
    const {
        data,
        error,
        listData,
        addRow,
        addDerivationToRow,
        editDerivation,
        deleteDerivation,
        editCell,
        uploadFileToDrive,
        availableSheets,
        sheetName,
        setSheetName
    } = useSheetService();

    const [expandedRow, setExpandedRow] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        listData();
    }, [sheetName, listData]);

    if (error) {
        return (
            <div className="p-8 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-xl">
                <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg">
                    Error al cargar datos: {error}
                </div>
                <button
                    onClick={listData}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mt-4"
                >
                    Recargar Datos
                </button>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="text-center p-10 text-blue-600">
                Cargando datos...
            </div>
        );
    }

    const filteredData = data.filter((row: SheetRow) => {
        const asunto = row["asunto"]?.toLowerCase() || "";
        const exp = row["exp. mesa de partes / sec. gen."]?.toLowerCase() || "";
        return (
            asunto.includes(searchTerm.toLowerCase()) ||
            exp.includes(searchTerm.toLowerCase())
        );
    });

    const reversedData = [...filteredData].reverse();

    const handleAddDocument = async (newDoc: NewDocumentData, file?: File) => {
        const newRowIndex = await addRow(newDoc);
        if (file) {
            await uploadFileToDrive(file, newRowIndex);
            await listData();
        }
        setShowModal(false);
    };

    return (
        <div className="p-0">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <input
                    type="text"
                    placeholder="Buscar por Asunto o Exp. Mesa de Partes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-full sm:w-1/2 text-sm"
                />

                <div className="flex gap-2 items-center">
                    <select
                        value={sheetName}
                        onChange={(e) => setSheetName(e.target.value)}
                        className="px-3 py-2 border rounded-lg text-sm bg-white shadow-sm"
                    >
                        {availableSheets.map((name: string) => (
                            <option key={name} value={name}>
                                {name}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={listData}
                        className="bg-gray-700 text-white py-2 px-4 rounded-lg shadow-md hover:bg-gray-800 transition font-medium text-sm"
                    >
                        🔄 Recargar ({data.length})
                    </button>

                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-green-600 text-white py-2 px-4 rounded-lg shadow-md hover:bg-green-700 transition font-medium text-sm hidden sm:flex"
                    >
                        ➕ Nuevo Documento
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-2xl p-0">
                <DataTable
                    rows={reversedData}
                    expandedRow={expandedRow}
                    onToggleRow={(index) =>
                        setExpandedRow(expandedRow === index ? null : index)
                    }
                    onAddDerivation={(reversedIndex, value) => {
                        const row = reversedData[reversedIndex];
                        const originalIndex = data.findIndex(r => r === row);
                        return addDerivationToRow(originalIndex, value);
                    }}
                    onEditDerivation={(reversedIndex, key, value) => {
                        const row = reversedData[reversedIndex];
                        const originalIndex = data.findIndex(r => r === row);
                        return editDerivation(originalIndex, key, value);
                    }}
                    onDeleteDerivation={(reversedIndex, key) => {
                        const row = reversedData[reversedIndex];
                        const originalIndex = data.findIndex(r => r === row);
                        return deleteDerivation(originalIndex, key);
                    }}
                    onEditCell={(reversedIndex, key, value) => {
                        const row = reversedData[reversedIndex];
                        const originalIndex = data.findIndex(r => r === row);
                        return editCell(originalIndex, key, value);
                    }}
                    onUploadFile={async (file, reversedIndex) => {
                        const row = reversedData[reversedIndex];
                        const originalIndex = data.findIndex(r => r === row);
                        await uploadFileToDrive(file, originalIndex);
                    }}
                />
            </div>

            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
                    <div className="bg-zinc-50 rounded-xl shadow-xl max-w-3xl w-full p-6 relative">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
                        >
                            ✖
                        </button>
                        <AddDocument
                            onAddRow={handleAddDocument}
                            disabled={false}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default List;
