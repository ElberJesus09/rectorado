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
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950 p-4">
                <div className="max-w-lg w-full bg-white dark:bg-slate-900 border border-red-300 dark:border-red-900/50 rounded-xl shadow-2xl p-8 text-center">
                    <div className="p-4 mb-6 text-sm text-red-600 dark:text-red-200 bg-red-100 dark:bg-red-900/20 rounded-lg border border-red-300 dark:border-red-800">
                        Error al cargar datos: {error}
                    </div>
                    <button
                        onClick={listData}
                        className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
                    >
                        Reintentar conexión
                    </button>
                </div>
            </div>
        );
    }

    if (data.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950 text-slate-500 dark:text-slate-400 gap-4">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="animate-pulse font-light tracking-wide">Cargando sistema...</p>
            </div>
        );
    }

    const filteredData = data.filter((row: SheetRow) => {
        const asunto = row["asunto"]?.toLowerCase() || "";
        const exp = row["exp. mesa de partes / sec. gen."]?.toLowerCase() || "";
        return asunto.includes(searchTerm.toLowerCase()) || exp.includes(searchTerm.toLowerCase());
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
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 p-4 sm:p-6 lg:p-8 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
                    <div className="w-full lg:w-1/2 relative group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-slate-400 group-focus-within:text-indigo-500 transition-colors">🔍</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Buscar por Asunto o Expediente..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200"
                        />
                    </div>

                    <div className="flex flex-wrap gap-3 items-center w-full lg:w-auto justify-end">
                        <select
                            value={sheetName}
                            onChange={(e) => setSheetName(e.target.value)}
                            className="px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 outline-none cursor-pointer"
                        >
                            {availableSheets.map((name: string) => (
                                <option key={name} value={name} className="bg-white dark:bg-slate-800">
                                    {name}
                                </option>
                            ))}
                        </select>

                        <button
                            onClick={listData}
                            className="px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2"
                        >
                            <span className="text-indigo-500">↻</span>
                            Recargar ({data.length})
                        </button>

                        <button
                            onClick={() => setShowModal(true)}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all duration-200 text-sm font-medium flex items-center gap-2"
                        >
                            <span>＋</span>
                            <span className="hidden sm:inline">Nuevo Documento</span>
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
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
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowModal(false)}
                        />
                        <div className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl shadow-2xl max-w-3xl w-full p-6 relative z-10">
                            <button
                                onClick={() => setShowModal(false)}
                                className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 rounded-full w-8 h-8 flex items-center justify-center"
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-6 border-b border-slate-200 dark:border-slate-800 pb-4">
                                Agregar Nuevo Documento
                            </h2>
                            <AddDocument onAddRow={handleAddDocument} disabled={false} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default List;
