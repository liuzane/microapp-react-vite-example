
    export type RemoteKeys = 'shared/consts/db' | 'shared/components' | 'shared/utils/antdTheme';
    type PackageType<T> = T extends 'shared/utils/antdTheme' ? typeof import('shared/utils/antdTheme') :T extends 'shared/components' ? typeof import('shared/components') :T extends 'shared/consts/db' ? typeof import('shared/consts/db') :any;