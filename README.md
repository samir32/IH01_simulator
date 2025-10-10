# IH01_simulator
Generic CMMS - SAP GUI Style Hierarchy Manager

SAP GUI inspired web application for managing technical equipment hierarchies. Built with React and Tailwind CSS to replicate the classic SAP IH01 transaction interface.

🎯 Features

Classic SAP GUI Interface
Authentic Windows XP-style blue gradient title bar
Classic gray interface colors and Windows button styles
Faithful recreation of SAP transaction layout with menu bar and status bar
Retro "MS Sans Serif" typography

Hierarchical Equipment Management
Four-level hierarchy system:
🏭 Functional Locations (gray) - Top-level plant/facility positions
🔧 Equipment (green) - Machinery and systems
📦 Assemblies (yellow) - Component groupings
🔩 Parts (red) - Individual components
Color-coded tree visualization matching SAP standards
Expandable/collapsible tree navigation
Dynamic tree structure display with proper indentation

Full CRUD Operations
✏️ Edit - Modify code, description, type, quantity, and unit for any item
➕ Add - Create new child items at any level
🗑️ Delete - Remove items and their children from the hierarchy
Real-time tree updates with automatic ID-based sorting

CSV Import/Export
📁 Import CSV - Upload custom hierarchies with automatic parsing
📥 Download Sample - Get a template CSV file to understand the format
📊 Export CSV - Download your modified hierarchy for backup or sharing
Maintains parent-child relationships through CSV format

Bilingual Support
🇫🇷 French and 🇬🇧 English language switching
Complete UI translation including menus, labels, and tooltips
Language picker in the title bar for quick switching

📋 CSV Format

The application uses a simple CSV structure:
```csv
id,code,description,type,quantity,unit,parentId
1,PLANT-A,Manufacturing Plant A,location,,,
2,LINE-01,Production Line 1,location,,,1
3,CONV-001,Conveyor System,equipment,1,EA,2
4,CONV-001-ASM01,Drive Assembly,assembly,1,EA,3
5,MOT-5HP-001,Motor 5HP Electric,part,1,EA,4
```

Supported types: `location`, `equipment`, `assembly`, `part`

🛠️ Technical Stack

React - Component-based UI architecture
TypeScript - Type-safe development
Tailwind CSS v4 - Utility-first styling
shadcn/ui - Accessible component library
Lucide React - Icon system

🚀 Use Cases

CMMS Testing - Test equipment hierarchies before importing to production systems
Training - Familiarize users with SAP-style interfaces
Data Preparation - Build and validate equipment structures offline
Maintenance Planning - Visualize and organize facility equipment
Documentation - Create visual representations of technical positions

🎨 Design Philosophy

This application pays homage to the classic enterprise software design of the early 2000s, specifically SAP's GUI interface running on Windows XP. It captures the nostalgia of gray beveled buttons, colored status indicators, and hierarchical tree structures that defined an era of business software.

📝 License

Open source - feel free to use and modify for your own projects.

---

Note: This is a standalone web application and does not connect to actual SAP systems. It's designed for offline hierarchy management and CSV-based data exchange.
