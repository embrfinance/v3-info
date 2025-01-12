import gql from 'graphql-tag';
export const TokenSnapshot = gql`
    fragment TokenSnapshot on TokenSnapshot {
        id
        timestamp
        totalBalanceUSD
        totalBalanceNotional
        totalVolumeUSD
        totalVolumeNotional
        totalSwapCount
    }
`;
export const LatestPrice = gql`
    fragment LatestPrice on LatestPrice {
        asset
        pricingAsset
        price
        priceUSD
        poolId {
            id
        }
    }
`;
export const User = gql`
    fragment User on User {
        id
        sharesOwned(first: 1000) {
            balance
            poolId {
                id
            }
        }
    }
`;
export const BalancerTokenPrice = gql`
    fragment BalancerTokenPrice on TokenPrice {
        id
        poolId {
            id
        }
        asset
        amount
        pricingAsset
        price
        block
        timestamp
        priceUSD
    }
`;
export const BalancerPoolToken = gql`
    fragment BalancerPoolToken on PoolToken {
        id
        symbol
        name
        decimals
        address
        balance
        invested
        weight
        priceRate
        poolId {
            id
            address
        }
    }
`;
export const BalancerPool = gql`
    fragment BalancerPool on Pool {
        id
        address
        poolType
        symbol
        name
        swapFee
        totalWeight
        totalSwapVolume
        totalSwapFee
        totalLiquidity
        totalShares
        swapsCount
        holdersCount
        createTime
        owner
        strategyType
        swapEnabled
        tokens(first: 1000) {
            ...BalancerPoolToken
        }
    }
    ${BalancerPoolToken}
`;
export const BalancerPoolSnapshot = gql`
    fragment BalancerPoolSnapshot on PoolSnapshot {
        id
        pool {
            id
        }
        totalShares
        swapVolume
        swapFees
        timestamp
    }
`;
export const BalancerJoinExit = gql`
    fragment BalancerJoinExit on JoinExit {
        amounts
        id
        sender
        timestamp
        tx
        type
        valueUSD
        user {
            id
        }
        pool {
            id
            tokensList
        }
    }
`;
export const BalancerSwap = gql`
    fragment BalancerSwap on Swap {
        id
        caller
        tokenIn
        tokenInSym
        tokenOut
        tokenOutSym
        tokenAmountIn
        tokenAmountOut
        poolId {
            id
            name
            address
            swapFee
        }
        userAddress {
            id
        }
        timestamp
        tx
        valueUSD
    }
`;
export const BalancerToken = gql`
    fragment BalancerToken on Token {
        id
        address
        decimals
        name
        symbol
        totalBalanceUSD
        totalBalanceNotional
        totalVolumeUSD
        totalVolumeNotional
        totalSwapCount
        latestPrice {
            asset
            pricingAsset
            price
            poolId {
                id
            }
        }
    }
`;
export const BalancerTradePair = gql`
    fragment BalancerTradePair on TradePair {
        id
        token0 {
            ...BalancerToken
        }
        token1 {
            ...BalancerToken
        }
        totalSwapVolume
        totalSwapFee
    }
    ${BalancerToken}
`;
export const BalancerSnapshot = gql`
    fragment BalancerSnapshot on BalancerSnapshot {
        id
        timestamp
        poolCount
        totalLiquidity
        totalSwapCount
        totalSwapVolume
        totalSwapFee
    }
`;
export const GetProtocolData = gql`
    query GetProtocolData($startTimestamp: Int!, $block24: Block_height!, $block48: Block_height!) {
        balancers(first: 1) {
            totalLiquidity
            totalSwapCount
            totalSwapFee
            totalSwapVolume
            poolCount
        }
        balancers24: balancers(first: 1, block: $block24) {
            totalLiquidity
            totalSwapCount
            totalSwapFee
            totalSwapVolume
            poolCount
        }
        balancers48: balancers(first: 1, block: $block48) {
            totalLiquidity
            totalSwapCount
            totalSwapFee
            totalSwapVolume
            poolCount
        }
        balancerSnapshots(
            first: 1000
            orderBy: timestamp
            orderDirection: asc
            where: { timestamp_gte: $startTimestamp }
        ) {
            ...BalancerSnapshot
        }
        whaleSwaps: swaps(first: 100, orderBy: timestamp, orderDirection: desc, where: { valueUSD_gte: "10000" }) {
            ...BalancerSwap
        }
    }
    ${BalancerSnapshot}
    ${BalancerSwap}
`;
export const GetTokenData = gql`
    query GetTokenData($block24: Block_height!, $blockWeek: Block_height!) {
        tokens: tokens(first: 1000, orderBy: totalBalanceUSD, orderDirection: desc) {
            ...BalancerToken
        }
        prices: latestPrices(first: 1000) {
            ...LatestPrice
        }
        tokens24: tokens(first: 1000, orderBy: totalBalanceUSD, orderDirection: desc, block: $block24) {
            ...BalancerToken
        }
        prices24: latestPrices(first: 1000, block: $block24) {
            ...LatestPrice
        }
        tokensWeek: tokens(first: 1000, orderBy: totalBalanceUSD, orderDirection: desc, block: $blockWeek) {
            ...BalancerToken
        }
        pricesWeek: latestPrices(first: 1000, block: $blockWeek) {
            ...LatestPrice
        }
    }
    ${BalancerToken}
    ${LatestPrice}
`;
export const GetTokenPageData = gql`
    query GetTokenPageData($address: String!, $startTimestamp: Int!) {
        tokenSnapshots(
            first: 1000
            orderBy: timestamp
            orderDirection: asc
            where: { token: $address, timestamp_gte: $startTimestamp }
        ) {
            ...TokenSnapshot
        }
    }
    ${TokenSnapshot}
`;
export const GetTransactionData = gql`
    query GetTransactionData($addresses: [Bytes!]!, $poolIds: [String!]!, $startTimestamp: Int!) {
        swapsIn: swaps(
            first: 1000
            orderBy: timestamp
            orderDirection: desc
            where: { tokenIn_in: $addresses, poolId_in: $poolIds, timestamp_gte: $startTimestamp }
        ) {
            ...BalancerSwap
        }
        swapsOut: swaps(
            first: 1000
            orderBy: timestamp
            orderDirection: desc
            where: { tokenOut_in: $addresses, poolId_in: $poolIds, timestamp_gte: $startTimestamp }
        ) {
            ...BalancerSwap
        }
        joinExits(
            first: 150
            orderBy: timestamp
            orderDirection: desc
            where: { pool_in: $poolIds, timestamp_gte: $startTimestamp }
        ) {
            ...BalancerJoinExit
        }
    }
    ${BalancerSwap}
    ${BalancerJoinExit}
`;
export const GetPoolData = gql`
    query GetPoolData($block24: Block_height!, $block48: Block_height!, $blockWeek: Block_height!) {
        pools(first: 1000, orderBy: totalLiquidity, orderDirection: desc, where: { totalLiquidity_gt: "0.01" }) {
            ...BalancerPool
        }
        pools24: pools(
            first: 1000
            orderBy: totalLiquidity
            orderDirection: desc
            where: { totalLiquidity_gt: "0.01" }
            block: $block24
        ) {
            ...BalancerPool
        }
        pools48: pools(
            first: 1000
            orderBy: totalLiquidity
            orderDirection: desc
            where: { totalLiquidity_gt: "0.01" }
            block: $block48
        ) {
            ...BalancerPool
        }
        poolsWeek: pools(
            first: 1000
            orderBy: totalLiquidity
            orderDirection: desc
            where: { totalLiquidity_gt: "0.01" }
            block: $blockWeek
        ) {
            ...BalancerPool
        }
        prices: latestPrices(first: 1000) {
            ...LatestPrice
        }
    }
    ${BalancerPool}
    ${LatestPrice}
`;
export const GetPoolChartData = gql`
    query GetPoolChartData($poolId: String!, $startTimestamp: Int!) {
        poolSnapshots(
            first: 1000
            orderBy: timestamp
            orderDirection: asc
            where: { pool: $poolId, timestamp_gte: $startTimestamp }
        ) {
            id
            amounts
            totalShares
            swapVolume
            swapFees
            timestamp
            totalSwapVolume
            totalSwapFee
            totalLiquidity
            swapsCount
            holdersCount
            pool {
                id
            }
        }
    }
`;
export const BalancerProtocolData = gql`
    query BalancerProtocolData(
        $skip: Int
        $first: Int
        $orderBy: Balancer_orderBy
        $orderDirection: OrderDirection
        $where: Balancer_filter
        $block: Block_height
    ) {
        balancers(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            id
            totalLiquidity
            totalSwapVolume
            totalSwapFee
            poolCount
            totalSwapCount
        }
    }
`;
export const BalancerUser = gql`
    query BalancerUser($id: ID!, $block: Block_height) {
        user(id: $id, block: $block) {
            ...User
        }
    }
    ${User}
`;
export const BalancerUsers = gql`
    query BalancerUsers(
        $skip: Int
        $first: Int
        $orderBy: User_orderBy
        $orderDirection: OrderDirection
        $where: User_filter
        $block: Block_height
    ) {
        users(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...User
        }
    }
    ${User}
`;
export const BalancerTokenPrices = gql`
    query BalancerTokenPrices(
        $skip: Int
        $first: Int
        $orderBy: TokenPrice_orderBy
        $orderDirection: OrderDirection
        $where: TokenPrice_filter
        $block: Block_height
    ) {
        tokenPrices(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerTokenPrice
        }
    }
    ${BalancerTokenPrice}
`;
export const GetBalancerPools = gql`
    query GetBalancerPools(
        $skip: Int
        $first: Int
        $orderBy: Pool_orderBy
        $orderDirection: OrderDirection
        $where: Pool_filter
        $block: Block_height
    ) {
        pools(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerPool
        }
    }
    ${BalancerPool}
`;
export const GetBalancerPool = gql`
    query GetBalancerPool($id: ID!, $block: Block_height) {
        pool(id: $id, block: $block) {
            ...BalancerPool
        }
    }
    ${BalancerPool}
`;
export const BalancerPoolTokens = gql`
    query BalancerPoolTokens(
        $skip: Int
        $first: Int
        $orderBy: PoolToken_orderBy
        $orderDirection: OrderDirection
        $where: PoolToken_filter
        $block: Block_height
    ) {
        poolTokens(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerPoolToken
        }
    }
    ${BalancerPoolToken}
`;
export const BalancerPoolHistoricalLiquidities = gql`
    query BalancerPoolHistoricalLiquidities(
        $skip: Int
        $first: Int
        $orderBy: PoolHistoricalLiquidity_orderBy
        $orderDirection: OrderDirection
        $where: PoolHistoricalLiquidity_filter
        $block: Block_height
    ) {
        poolHistoricalLiquidities(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            id
            poolId {
                id
            }
            poolTotalShares
            poolLiquidity
            poolShareValue
            pricingAsset
            block
        }
    }
`;
export const BalancerPoolSnapshots = gql`
    query BalancerPoolSnapshots(
        $skip: Int
        $first: Int
        $orderBy: PoolSnapshot_orderBy
        $orderDirection: OrderDirection
        $where: PoolSnapshot_filter
        $block: Block_height
    ) {
        poolSnapshots(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerPoolSnapshot
        }
    }
    ${BalancerPoolSnapshot}
`;
export const BalancerLatestPrices = gql`
    query BalancerLatestPrices(
        $skip: Int
        $first: Int
        $orderBy: LatestPrice_orderBy
        $orderDirection: OrderDirection
        $where: LatestPrice_filter
        $block: Block_height
    ) {
        latestPrices(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            id
            asset
            price
            poolId {
                id
            }
            pricingAsset
        }
    }
`;
export const BalancerJoinExits = gql`
    query BalancerJoinExits(
        $skip: Int
        $first: Int
        $orderBy: JoinExit_orderBy
        $orderDirection: OrderDirection
        $where: JoinExit_filter
        $block: Block_height
    ) {
        joinExits(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerJoinExit
        }
    }
    ${BalancerJoinExit}
`;
export const BalancePortfolioData = gql`
    query BalancePortfolioData($id: ID!, $previousBlockNumber: Int!) {
        user(id: $id) {
            ...User
        }
        pools(first: 1000, where: { totalShares_gt: "0" }) {
            ...BalancerPool
        }
        previousUser: user(id: $id, block: { number: $previousBlockNumber }) {
            ...User
        }
        previousPools: pools(first: 1000, where: { totalShares_gt: "0" }, block: { number: $previousBlockNumber }) {
            ...BalancerPool
        }
    }
    ${User}
    ${BalancerPool}
`;
export const BalancerSwaps = gql`
    query BalancerSwaps(
        $skip: Int
        $first: Int
        $orderBy: Swap_orderBy
        $orderDirection: OrderDirection
        $where: Swap_filter
        $block: Block_height
    ) {
        swaps(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerSwap
        }
    }
    ${BalancerSwap}
`;
export const GetBalancerTokens = gql`
    query GetBalancerTokens(
        $skip: Int
        $first: Int
        $orderBy: Token_orderBy
        $orderDirection: OrderDirection
        $where: Token_filter
        $block: Block_height
    ) {
        tokens(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerToken
        }
    }
    ${BalancerToken}
`;
export const BalancerTradePairs = gql`
    query BalancerTradePairs(
        $skip: Int
        $first: Int
        $orderBy: TradePair_orderBy
        $orderDirection: OrderDirection
        $where: TradePair_filter
        $block: Block_height
    ) {
        tradePairs(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerTradePair
        }
    }
    ${BalancerTradePair}
`;
export const GetBalancerSnapshots = gql`
    query GetBalancerSnapshots(
        $skip: Int
        $first: Int
        $orderBy: BalancerSnapshot_orderBy
        $orderDirection: OrderDirection
        $where: BalancerSnapshot_filter
        $block: Block_height
    ) {
        balancerSnapshots(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...BalancerSnapshot
        }
    }
    ${BalancerSnapshot}
`;
export const GetLatestPrices = gql`
    query GetLatestPrices(
        $skip: Int
        $first: Int
        $orderBy: LatestPrice_orderBy
        $orderDirection: OrderDirection
        $where: LatestPrice_filter
        $block: Block_height
    ) {
        latestPrices(
            skip: $skip
            first: $first
            orderBy: $orderBy
            orderDirection: $orderDirection
            where: $where
            block: $block
        ) {
            ...LatestPrice
        }
    }
    ${LatestPrice}
`;
export const GetLatestBlock = gql`
    query GetLatestBlock {
        blocks(first: 1, orderBy: timestamp, orderDirection: desc) {
            id
            number
            timestamp
        }
    }
`;
