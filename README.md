# IH01 Simulator – SAP-Style Hierarchy Viewer

[![GitHub Pages](https://img.shields.io/badge/Live_on-GitHub_Pages-2ea44f?logo=github)](https://samir32.github.io/IH01_simulator/)

A lightweight web application that replicates the look and behavior of the SAP IH01 transaction to visualize and manage equipment hierarchies.  
Built with **React**, **TypeScript**, and **Tailwind CSS**, this tool lets you explore and edit hierarchies locally without needing a CMMS or SAP upload.

---

## 🎯 Features – SAP-Style Interface

- Familiar layout with menu bar, toolbar, and status bar  
- Visual styling modeled after SAP’s classic hierarchy viewer  
- Clear color-coded hierarchy visualization  

---

## 🧩 Hierarchy Visualization and Editing

Four structured levels:

- 🏭 **Functional Locations** – Top-level plant or area positions  
- 🔧 **Equipment** – Machines or systems  
- 📦 **Assemblies** – Component groups  
- 🔩 **Parts** – Individual components  

Features:
- Expandable and collapsible tree navigation  
- Live editing of code, description, type, quantity, and unit  
- Add or delete nodes dynamically with automatic re-sorting  

---

## 📁 CSV Import / Export

- **Import CSV** – Upload your own hierarchy for visualization  
- **Export CSV** – Download the edited hierarchy for CMMS or SAP import  
- **Download Sample** – Get a ready-to-use CSV template  
- Parent-child relationships preserved automatically  

---

## 🌐 Bilingual Interface

- French and English available  
- Menus, labels, and tooltips translated  
- Language selector in the toolbar  

---

## 🧾 CSV Format

Example structure used by the application:

```csv
id,code,description,type,quantity,unit,parentId
1,PLANT-A,Manufacturing Plant A,location,,,
2,LINE-01,Production Line 1,location,,,1
3,CONV-001,Conveyor System,equipment,1,EA,2
4,CONV-001-ASM01,Drive Assembly,assembly,1,EA,3
5,MOT-5HP-001,Motor 5HP Electric,part,1,EA,4
