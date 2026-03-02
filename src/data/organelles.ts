export interface OrganelleData {
  id: string;
  name: string;
  description: string;
  color: string;
  cellType: 'both' | 'animal' | 'plant';
}

export const organelles: OrganelleData[] = [
  { id: 'nucleus', name: '細胞核', description: '具有遺傳物質，可控制細胞生理活動', color: '#a855f7', cellType: 'both' },
  { id: 'er', name: '內質網', description: '合成、修飾、運輸蛋白質與製造脂質', color: '#3b82f6', cellType: 'both' },
  { id: 'ribosome', name: '核糖體', description: '解讀遺傳物質，合成蛋白質', color: '#ef4444', cellType: 'both' },
  { id: 'mitochondria', name: '粒線體', description: '進行呼吸作用產生能量的場所（細胞發電廠）', color: '#f97316', cellType: 'both' },
  { id: 'golgi', name: '高基氏體', description: '運輸、修飾蛋白質及分泌物質', color: '#ec4899', cellType: 'both' },
  { id: 'cell_membrane', name: '細胞膜', description: '區隔細胞內外的環境，控制物質進出', color: '#f59e0b', cellType: 'both' },
  { id: 'cytoplasm', name: '細胞質', description: '由細胞質液、各種膜狀胞器與非膜狀構造組成，是進行化學反應的場所', color: '#64748b', cellType: 'both' },
  { id: 'vacuole', name: '液泡', description: '儲存水及代謝廢物', color: '#0ea5e9', cellType: 'both' },
  { id: 'lysosome', name: '溶體', description: '分解細胞內的大分子物質及衰老胞器', color: '#eab308', cellType: 'animal' },
  { id: 'centriole', name: '中心粒', description: '細胞分裂時可協助染色體分離', color: '#10b981', cellType: 'animal' },
  { id: 'chloroplast', name: '葉綠體', description: '進行光合作用的場所', color: '#22c55e', cellType: 'plant' },
  { id: 'cell_wall', name: '細胞壁', description: '保護、支持及維持細胞的形狀', color: '#15803d', cellType: 'plant' },
];
