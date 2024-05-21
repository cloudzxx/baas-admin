export interface Pagination {
  total: number;
  current: number;
  pageSize: number;
}

export interface TableData<T> {
  list: T[];
  pagination: Pagination;
}

export interface Organization {
  id: string;
  name: string;
  created_at: string;
  [key: string]: unknown;
}

export interface Agent {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

export interface Node {
  id: string;
  name: string;
  type: string;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

export interface Channel {
  id: string;
  name: string;
  created_at?: string;
  [key: string]: unknown;
}

export interface ChainCode {
  id: string;
  package_id: string;
  version: string;
  language: string;
  description: string;
  status: 'CREATED' | 'INSTALLED' | 'APPROVED' | 'COMMITTED';
  approvals: Record<string, boolean>;
  [key: string]: unknown;
}

export interface FiscoGroup {
  id: string;
  name: string;
  type: string;
  blockchain_type: string;
  group_id: number;
  chain_id: number;
  status: string;
  created_at: string;
  [key: string]: unknown;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  organization?: { id: string; name: string };
  created_at: string;
  [key: string]: unknown;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  org_name: string;
  agent_url: string;
}

export interface ApiResponse<T = unknown> {
  code?: number;
  status?: string;
  data?: T;
  total?: number;
  id?: string;
  detail?: string;
  msg?: string;
}
