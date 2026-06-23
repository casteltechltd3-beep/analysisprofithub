import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  jsonb,
  unique,
} from 'drizzle-orm/pg-core'

// Better Auth Tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  name: text('name'),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const account = pgTable(
  'account',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    provider: text('provider').notNull(),
    providerAccountId: text('providerAccountId').notNull(),
    refreshToken: text('refreshToken'),
    accessToken: text('accessToken'),
    expiresAt: integer('expiresAt'),
    tokenType: text('tokenType'),
    scope: text('scope'),
    idToken: text('idToken'),
    sessionState: text('sessionState'),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
    updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  },
  (table) => ({
    providerUnique: unique('provider_provider_account_id').on(
      table.provider,
      table.providerAccountId
    ),
  })
)

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// Trading Tables
export const tradingSessions = pgTable('trading_sessions', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('inactive'),
  market: text('market').notNull(),
  totalTurns: integer('totalTurns').default(0),
  maxTurns: integer('maxTurns').default(7),
  startedAt: timestamp('startedAt').notNull().defaultNow(),
  pausedAt: timestamp('pausedAt'),
  completedAt: timestamp('completedAt'),
  totalProfit: decimal('totalProfit', { precision: 18, scale: 8 }).default('0'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const signals = pgTable('signals', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  sessionId: text('sessionId')
    .notNull()
    .references(() => tradingSessions.id, { onDelete: 'cascade' }),
  market: text('market').notNull(),
  signalType: text('signalType').notNull(),
  status: text('status').notNull(),
  probability: integer('probability').notNull(),
  recommendation: text('recommendation').notNull(),
  entryCondition: text('entryCondition').notNull(),
  targetDigit: integer('targetDigit'),
  confidence: integer('confidence').notNull(),
  digitFrequencies: jsonb('digitFrequencies'),
  powerIndex: jsonb('powerIndex'),
  analyzedAt: timestamp('analyzedAt').notNull().defaultNow(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const trades = pgTable('trades', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  sessionId: text('sessionId')
    .notNull()
    .references(() => tradingSessions.id, { onDelete: 'cascade' }),
  signalId: text('signalId').references(() => signals.id, { onDelete: 'set null' }),
  market: text('market').notNull(),
  tradeType: text('tradeType').notNull(),
  entryPrice: decimal('entryPrice', { precision: 18, scale: 8 }).notNull(),
  takeProfit: decimal('takeProfit', { precision: 18, scale: 8 }).notNull(),
  stopLoss: decimal('stopLoss', { precision: 18, scale: 8 }).notNull(),
  tpTicks: integer('tpTicks').notNull(),
  slTicks: integer('slTicks').notNull(),
  quantity: decimal('quantity', { precision: 18, scale: 8 }).notNull(),
  status: text('status').notNull().default('pending'),
  profit: decimal('profit', { precision: 18, scale: 8 }),
  profitPercentage: decimal('profitPercentage', { precision: 5, scale: 2 }),
  turnNumber: integer('turnNumber').default(1),
  executedAt: timestamp('executedAt'),
  closedAt: timestamp('closedAt'),
  closeReason: text('closeReason'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const tradeLogs = pgTable('trade_logs', {
  id: text('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  tradeId: text('tradeId')
    .notNull()
    .references(() => trades.id, { onDelete: 'cascade' }),
  eventType: text('eventType').notNull(),
  price: decimal('price', { precision: 18, scale: 8 }),
  message: text('message'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export const marketData = pgTable(
  'market_data',
  {
    id: text('id').primaryKey(),
    userId: text('userId')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    market: text('market').notNull(),
    lastTick: decimal('lastTick', { precision: 18, scale: 8 }),
    bidPrice: decimal('bidPrice', { precision: 18, scale: 8 }),
    askPrice: decimal('askPrice', { precision: 18, scale: 8 }),
    lastUpdate: timestamp('lastUpdate').notNull().defaultNow(),
    createdAt: timestamp('createdAt').notNull().defaultNow(),
  },
  (table) => ({
    userMarketUnique: unique('user_market').on(table.userId, table.market),
  })
)
