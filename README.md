H01 Simulator – SAP-Style Hierarchy Viewer

A lightweight web application that replicates the look and behavior of the SAP IH01 transaction to visualize and manage equipment hierarchies.
Built with React, TypeScript, and Tailwind CSS, this tool lets you explore and edit hierarchies locally without needing a CMMS or SAP upload.

🎯 Features
SAP-Style Interface

Familiar layout with menu bar, toolbar, and status bar

Visual styling modeled after SAP’s classic hierarchy viewer

Clear color-coded hierarchy visualization

Hierarchy Visualization and Editing

Four structured levels:

🏭 Functional Locations – Top-level plant or area positions

🔧 Equipment – Machines or systems

📦 Assemblies – Component groups

🔩 Parts – Individual components

Expandable and collapsible tree navigation

Live editing of code, description, type, quantity, and unit

Add or delete nodes dynamically with automatic re-sorting

CSV Import / Export

Import CSV – Upload your own hierarchy for visualization

Export CSV – Download the edited hierarchy for CMMS or SAP import

Download Sample – Get a ready-to-use CSV template

Parent-child relationships preserved automatically

Bilingual Interface

🇫🇷 French and 🇬🇧 English available

Menu, labels, and tooltips translated

Language selector in the toolbar

📋 CSV Format

Example structure used by the application:

id,code,description,type,quantity,unit,parentId
1,PLANT-A,Manufacturing Plant A,location,,,
2,LINE-01,Production Line 1,location,,,1
3,CONV-001,Conveyor System,equipment,1,EA,2
4,CONV-001-ASM01,Drive Assembly,assembly,1,EA,3
5,MOT-5HP-001,Motor 5HP Electric,part,1,EA,4


Supported types:
location, equipment, assembly, part

🛠️ Technical Stack

React – component-based UI

TypeScript – type safety and maintainability

Tailwind CSS v4 – utility-first styling

shadcn/ui – accessible component library

Lucide React – modern icon set

Vite – fast build and development server

🚀 Use Cases

Hierarchy Design – build and validate structures before ERP upload

CMMS Testing – verify CSV structures before production use

Training – familiarize teams with SAP-style hierarchies

Documentation – create visual maps of plants and equipment

📝 License

Open-source — free to use and modify for personal or professional projects.
