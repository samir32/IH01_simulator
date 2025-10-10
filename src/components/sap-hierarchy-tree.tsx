import { TreeNode, TreeNodeData } from './tree-node';

const mockData: TreeNodeData[] = [
  {
    id: 'fl-001',
    name: 'Manufacturing Plant A',
    type: 'functional-location',
    code: 'PLANT-A',
    children: [
      {
        id: 'fl-001-01',
        name: 'Production Line 1',
        type: 'functional-location',
        code: 'PROD-L1',
        children: [
          {
            id: 'eq-001',
            name: 'Conveyor System',
            type: 'equipment',
            code: 'EQ-CV001',
            children: [
              {
                id: 'mat-001',
                name: 'Conveyor Belt',
                type: 'material',
                code: 'MAT-CVB01'
              },
              {
                id: 'mat-002',
                name: 'Motor Assembly',
                type: 'material',
                code: 'MAT-MOT01'
              }
            ]
          },
          {
            id: 'eq-002',
            name: 'Packaging Machine',
            type: 'equipment',
            code: 'EQ-PK001',
            children: [
              {
                id: 'mat-003',
                name: 'Sealing Unit',
                type: 'material',
                code: 'MAT-SU001'
              }
            ]
          }
        ]
      },
      {
        id: 'fl-001-02',
        name: 'Production Line 2',
        type: 'functional-location',
        code: 'PROD-L2',
        children: [
          {
            id: 'eq-003',
            name: 'Assembly Robot',
            type: 'equipment',
            code: 'EQ-ROB01',
            children: [
              {
                id: 'mat-004',
                name: 'Robotic Arm',
                type: 'material',
                code: 'MAT-ARM01'
              },
              {
                id: 'mat-005',
                name: 'Control Unit',
                type: 'material',
                code: 'MAT-CU001'
              }
            ]
          }
        ]
      },
      {
        id: 'fl-001-03',
        name: 'Quality Control',
        type: 'functional-location',
        code: 'QC-DEPT',
        children: [
          {
            id: 'eq-004',
            name: 'Testing Equipment',
            type: 'equipment',
            code: 'EQ-TEST01',
            children: [
              {
                id: 'mat-006',
                name: 'Calibration Kit',
                type: 'material',
                code: 'MAT-CAL01'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'fl-002',
    name: 'Warehouse Facility',
    type: 'functional-location',
    code: 'WAREHOUSE',
    children: [
      {
        id: 'fl-002-01',
        name: 'Storage Area A',
        type: 'functional-location',
        code: 'STOR-A',
        children: [
          {
            id: 'eq-005',
            name: 'Forklift Unit 1',
            type: 'equipment',
            code: 'EQ-FL001',
            children: [
              {
                id: 'mat-007',
                name: 'Hydraulic System',
                type: 'material',
                code: 'MAT-HYD01'
              }
            ]
          }
        ]
      },
      {
        id: 'fl-002-02',
        name: 'Loading Dock',
        type: 'functional-location',
        code: 'LOAD-DOCK',
        children: [
          {
            id: 'eq-006',
            name: 'Dock Leveler',
            type: 'equipment',
            code: 'EQ-DL001'
          }
        ]
      }
    ]
  }
];

export function SapHierarchyTree() {
  return (
    <div className="bg-white border border-gray-300 h-full overflow-auto">
      <div className="border-b border-gray-300 bg-gray-50 px-4 py-2">
        <h3 className="text-sm">Equipment Hierarchy Structure</h3>
      </div>
      <div className="p-2">
        {mockData.map((node) => (
          <TreeNode key={node.id} node={node} level={0} />
        ))}
      </div>
    </div>
  );
}