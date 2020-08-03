/**
 * Copyright 2020, Yahoo Holdings Inc.
 * Licensed under the terms of the MIT license. See accompanying LICENSE.md file for terms.
 */
import { TableMetadataPayload } from '../../models/metadata/table';
import { MetricMetadataPayload } from '../../models/metadata/metric';
import { DimensionMetadataPayload } from '../../models/metadata/dimension';
import { TimeDimensionMetadataPayload } from '../../models/metadata/time-dimension';
import { MetricFunctionMetadataPayload } from '../../models/metadata/metric-function';

export interface EverythingMetadataPayload {
  tables: TableMetadataPayload[];
  metrics: MetricMetadataPayload[];
  dimensions: DimensionMetadataPayload[];
  timeDimensions: TimeDimensionMetadataPayload[];
  metricFunctions?: MetricFunctionMetadataPayload[];
}

export interface MetadataPayloadMap {
  everything: EverythingMetadataPayload;
  table: TableMetadataPayload[];
  metric: MetricMetadataPayload[];
  dimension: DimensionMetadataPayload[];
  timeDimension: TimeDimensionMetadataPayload[];
  metricFunctions: MetricMetadataPayload[];
}

export type RawMetadataPayload = unknown;

export default interface NaviMetadataSerializer {
  normalize<K extends keyof MetadataPayloadMap>(type: K, rawPayload: RawMetadataPayload): MetadataPayloadMap[K];
}
