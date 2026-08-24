import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as XLSX from 'xlsx';
import AdminPageHeader from '../components/ui/AdminPageHeader';
import AdminCard from '../components/ui/AdminCard';
import AdminButton from '../components/ui/AdminButton';
import AdminFormGroup from '../components/ui/AdminFormGroup';
import AdminInput from '../components/ui/AdminInput';
import AdminTextarea from '../components/ui/AdminTextarea';
import { cmsService } from '../../services/cmsService';
import { Save, CheckCircle2, AlertCircle, ArrowLeft, Upload, Link as LinkIcon, FileSpreadsheet } from 'lucide-react';

export interface CalendarSection {
  type: 'text' | 'table';
  content?: string;
  tableData?: string[][];
}

export default function AdminAcademicCalendarEditor() {
  const [introText, setIntroText] = useState(
    'An academic year is divided into two semesters namely SPRING and FALL, each of 17 weeks duration. The SPRING semester starts in January and concludes in June. The FALL semester starts in August and concludes in December.'
  );
  
  const [fileName, setFileName] = useState('');
  const [sheetUrl, setSheetUrl] = useState('');
  const [sections, setSections] = useState<CalendarSection[]>([]);
  
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await cmsService.getSetting<any>('academic_calendar_content', null);
      if (data) {
        if (data.introText) setIntroText(data.introText);
        if (data.fileName) setFileName(data.fileName);
        if (data.sheetUrl) setSheetUrl(data.sheetUrl);
        if (data.sections && Array.isArray(data.sections)) setSections(data.sections);
      }
    };
    loadData();
  }, []);

  const parseArrayOfArrays = (data: any[][]) => {
    const newSections: CalendarSection[] = [];
    let currentTable: string[][] | null = null;

    for (const row of data) {
      // Normalize row: map undefined/null to empty string, and trim
      const normalizedRow = row.map(cell => (cell !== null && cell !== undefined ? String(cell).trim() : ''));
      
      // Check how many cells actually have content
      const filledCells = normalizedRow.filter(c => c !== '');
      
      if (filledCells.length === 0) continue; // skip entirely empty rows

      if (filledCells.length === 1) {
        // Text block
        if (currentTable) {
          newSections.push({ type: 'table', tableData: currentTable });
          currentTable = null;
        }
        newSections.push({ type: 'text', content: filledCells[0] });
      } else {
        // Table row
        if (!currentTable) {
          currentTable = [];
        }
        // Pad the row to match the max length seen so far in currentTable (optional, but good for cleanliness)
        currentTable.push(normalizedRow);
      }
    }

    if (currentTable) {
      newSections.push({ type: 'table', tableData: currentTable });
    }

    // Clean up tables: ensure all rows in a table have the same number of columns by padding with empty strings
    newSections.forEach(sec => {
      if (sec.type === 'table' && sec.tableData) {
        const maxCols = Math.max(...sec.tableData.map(r => r.length));
        sec.tableData = sec.tableData.map(r => {
          const newRow = [...r];
          while (newRow.length < maxCols) newRow.push('');
          return newRow;
        });
      }
    });

    setSections(newSections);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setSheetUrl(''); // Clear URL if a file is uploaded directly
    setMessage(null);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const ab = evt.target?.result as ArrayBuffer;
        const wb = XLSX.read(ab, { type: 'array' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        
        // Convert to array of arrays, defval ensures empty cells are empty strings rather than undefined
        const data = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });
        
        parseArrayOfArrays(data);
      } catch (err) {
        console.error(err);
        setMessage({ type: 'error', text: 'Failed to parse the uploaded file. Please ensure it is a valid spreadsheet.' });
      }
    };
    reader.readAsArrayBuffer(file);
    // Reset file input
    e.target.value = '';
  };

  const handleUrlFetch = async () => {
    if (!sheetUrl.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid Google Sheets URL.' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Extract Google Sheet ID
      // Example: https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0
      const match = sheetUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
      if (!match || !match[1]) {
        throw new Error("Could not extract Sheet ID from URL.");
      }
      
      const sheetId = match[1];
      const exportUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

      const response = await fetch(exportUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch spreadsheet. Ensure 'Anyone with the link can view' is enabled.");
      }

      const ab = await response.arrayBuffer();
      const wb = XLSX.read(ab, { type: 'array' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<any[]>(ws, { header: 1, defval: '' });
      
      parseArrayOfArrays(data);
      setFileName('Google Sheet (Linked)');
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Failed to fetch the Google Sheet.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    const payload = {
      introText,
      fileName,
      sheetUrl,
      sections,
      updated_at: new Date().toISOString(),
    };

    const res = await cmsService.saveSetting('academic_calendar_content', payload, 'Academic Calendar Settings');
    setSaving(false);

    if (res.success) {
      setMessage({ type: 'success', text: 'Academic Calendar saved successfully.' });
      setTimeout(() => setMessage(null), 4000);
    } else {
      setMessage({ type: 'error', text: res.error || 'Failed to save changes.' });
    }
  };

  const removeSpreadsheet = () => {
    setFileName('');
    setSheetUrl('');
    setSections([]);
  };

  return (
    <div className="space-y-6 text-left max-w-[1250px]">
      <div className="flex items-center gap-4 mb-2">
        <Link
          to="/admin-panel5463/useful-links"
          className="p-2 bg-white border border-[#E5E7EB] rounded-md text-[#4B5563] hover:text-[#0093DD] transition-colors"
          title="Back to Useful Links"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <AdminPageHeader
          title="Edit Academic Calendar"
          subtitle="Manage the academic calendar spreadsheet displayed on the public website."
          action={
            <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Calendar
            </AdminButton>
          }
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg border text-sm font-medium flex items-center gap-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Intro Text */}
      <AdminCard className="space-y-4">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-[#0093DD]" />
          <span>1. Introduction Text</span>
        </h3>
        
        <AdminFormGroup label="Page Description / Information Box">
          <AdminTextarea 
            rows={4} 
            value={introText} 
            onChange={(e) => setIntroText(e.target.value)} 
            placeholder="An academic year is divided into two semesters..."
          />
        </AdminFormGroup>
      </AdminCard>

      {/* Data Source */}
      <AdminCard className="space-y-6">
        <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
          <LinkIcon className="w-5 h-5 text-[#0093DD]" />
          <span>2. Spreadsheet Data Source</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Upload File */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#374151]">Option A: Upload File</h4>
            <p className="text-xs text-[#6B7280]">Upload an exported .xlsx, .xls, or .csv file.</p>
            <label className="px-4 py-2.5 bg-[#0093DD] hover:bg-[#0C71C3] text-white text-sm font-semibold rounded-md cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Spreadsheet</span>
              <input 
                type="file" 
                accept=".xlsx, .xls, .csv" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
          </div>

          {/* Google Sheets URL */}
          <div className="space-y-3 border-l md:border-l-0 border-t md:border-t-0 border-[#E5E7EB] pt-6 md:pt-0 pl-0 md:pl-8">
            <h4 className="text-sm font-bold text-[#374151]">Option B: Google Sheets URL</h4>
            <p className="text-xs text-[#6B7280]">Link a public Google Sheet (Must be "Anyone with link can view").</p>
            <div className="flex gap-2">
              <AdminInput 
                value={sheetUrl}
                onChange={(e) => setSheetUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/..."
              />
              <AdminButton variant="secondary" onClick={handleUrlFetch} loading={loading}>
                Fetch
              </AdminButton>
            </div>
          </div>
        </div>

        {/* Current File Display */}
        {fileName && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSpreadsheet className="w-6 h-6 text-blue-600" />
              <div>
                <p className="text-sm font-bold text-blue-900">Current Data Source</p>
                <p className="text-xs text-blue-700">{fileName}</p>
              </div>
            </div>
            <button 
              type="button" 
              onClick={removeSpreadsheet}
              className="text-xs font-semibold text-red-600 hover:text-red-700 px-3 py-1.5 border border-red-200 hover:bg-red-50 rounded"
            >
              Remove
            </button>
          </div>
        )}
      </AdminCard>

      {/* CMS Preview */}
      {sections.length > 0 && (
        <AdminCard className="space-y-4">
          <h3 className="text-base font-bold text-[#1F2937] border-b border-[#F3F4F6] pb-2 flex items-center gap-2">
            <span>3. Calendar Preview</span>
          </h3>
          <p className="text-xs text-[#6B7280]">
            This is how the parser interpreted your spreadsheet. Ensure tables and headings look correct.
          </p>
          
          <div className="p-6 bg-white border border-[#E5E7EB] rounded-lg space-y-8 overflow-x-auto shadow-inner">
            {sections.map((section, secIdx) => {
              if (section.type === 'text') {
                // If it looks like a main heading (first item or short text)
                return (
                  <h4 key={secIdx} className="text-lg font-bold text-[#0C71C3] border-b border-[#E2E8F0] pb-2">
                    {section.content}
                  </h4>
                );
              } else if (section.type === 'table' && section.tableData) {
                return (
                  <table key={secIdx} className="w-full text-sm text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr>
                        {section.tableData[0]?.map((cell, colIdx) => (
                          <th 
                            key={colIdx} 
                            className="px-4 py-3 bg-[#0C71C3] text-white font-semibold border border-[#0C71C3] whitespace-nowrap"
                          >
                            {cell}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {section.tableData.slice(1).map((row, rowIdx) => (
                        <tr key={rowIdx} className="even:bg-[#F8FAFC] hover:bg-[#F1F5F9] transition-colors">
                          {row.map((cell, colIdx) => (
                            <td 
                              key={colIdx} 
                              className={`px-4 py-3 border border-[#E2E8F0] text-[#334155] ${colIdx === 0 ? 'font-medium' : ''}`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                );
              }
              return null;
            })}
          </div>
        </AdminCard>
      )}

      <div className="flex justify-end pt-2">
        <AdminButton variant="primary" onClick={handleSave} loading={saving} icon={<Save className="w-4 h-4" />}>
          Save Calendar
        </AdminButton>
      </div>
    </div>
  );
}
