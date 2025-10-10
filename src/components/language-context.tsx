import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'fr' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  fr: {
    // Window Title
    'sap': 'Generic CMMS',
    
    // Menu Bar
    'menu.edit': 'Éditer',
    'menu.process': 'Traiter',
    'menu.jump': 'Saut',
    'menu.other_functions': 'Autres fonctions',
    'menu.environment': 'Environnement',
    'menu.options': 'Options',
    'menu.system': 'Système',
    'menu.help': 'Aide',
    
    // Toolbar
    'toolbar.new_up': 'Nouveau vers le haut',
    'toolbar.all_details': 'Tout détails',
    'toolbar.change_item': 'Changer article',
    
    // Main Content
    'main.title': 'Poste technique, représent. structure: nomenclature',
    'main.technical_position': 'Poste technique',
    'main.designation': 'Désignation',
    
    // Tree Headers
    'tree.code': 'Code',
    'tree.description': 'Description',
    'tree.quantity': 'Qté',
    'tree.unit': 'Unité',
    'tree.type': 'Type',
    
    // Status Bar
    'status.ready': 'Prêt',
    
    // File Upload
    'upload.upload_csv': 'Importer CSV',
    'upload.download_sample': 'Télécharger Exemple',
    'upload.csv_format': 'Format CSV: id, code, description, type (location/equipment/assembly/part), quantity, unit, parentId',
    'upload.loading': 'Chargement...',
    
    // Tree Actions
    'tree.add': 'Ajouter',
    'tree.remove': 'Supprimer',
    'tree.edit': 'Modifier',
    'tree.move_up': 'Monter',
    'tree.move_down': 'Descendre',
    'tree.export_csv': 'Exporter CSV',
    
    // Types
    'type.location': 'Poste',
    'type.equipment': 'Équipement',
    'type.assembly': 'Assemblage',
    'type.part': 'Pièce',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English'
  },
  en: {
    // Window Title
    'sap': 'Generic CMMS',
    
    // Menu Bar
    'menu.edit': 'Edit',
    'menu.process': 'Process',
    'menu.jump': 'Jump',
    'menu.other_functions': 'Other Functions',
    'menu.environment': 'Environment',
    'menu.options': 'Options',
    'menu.system': 'System',
    'menu.help': 'Help',
    
    // Toolbar
    'toolbar.new_up': 'New Up',
    'toolbar.all_details': 'All Details',
    'toolbar.change_item': 'Change Item',
    
    // Main Content
    'main.title': 'Technical Position, Structure Representation: Bill of Materials',
    'main.technical_position': 'Technical Position',
    'main.designation': 'Designation',
    
    // Tree Headers
    'tree.code': 'Code',
    'tree.description': 'Description',
    'tree.quantity': 'Qty',
    'tree.unit': 'Unit',
    'tree.type': 'Type',
    
    // Status Bar
    'status.ready': 'Ready',
    
    // File Upload
    'upload.upload_csv': 'Upload CSV',
    'upload.download_sample': 'Download Sample',
    'upload.csv_format': 'CSV Format: id, code, description, type (location/equipment/assembly/part), quantity, unit, parentId',
    'upload.loading': 'Loading...',
    
    // Tree Actions
    'tree.add': 'Add',
    'tree.remove': 'Remove',
    'tree.edit': 'Edit',
    'tree.move_up': 'Move Up',
    'tree.move_down': 'Move Down',
    'tree.export_csv': 'Export CSV',
    
    // Types
    'type.location': 'Location',
    'type.equipment': 'Equipment',
    'type.assembly': 'Assembly',
    'type.part': 'Part',
    
    // Languages
    'language.french': 'Français',
    'language.english': 'English'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('fr');
  
  const t = (key: string): string => {
    return translations[language][key] || key;
  };
  
  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}