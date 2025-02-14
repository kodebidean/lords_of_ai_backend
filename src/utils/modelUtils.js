const logger = require('./logger');

class ModelUtils {
    static calculateModelScore(characteristics, benchmarks) {
        try {
            const weights = {
                characteristics: 0.6,
                benchmarks: 0.4
            };

            const characteristicsScore = this.calculateCharacteristicsScore(characteristics);
            const benchmarksScore = this.calculateBenchmarksScore(benchmarks);

            return (characteristicsScore * weights.characteristics) + 
                   (benchmarksScore * weights.benchmarks);
        } catch (error) {
            logger.error('Error calculando score del modelo:', error);
            return null;
        }
    }

    static calculateCharacteristicsScore(characteristics) {
        if (!characteristics || characteristics.length === 0) return 0;

        const weightedSum = characteristics.reduce((sum, char) => {
            return sum + (char.value * (char.confidence_level || 1));
        }, 0);

        return weightedSum / characteristics.length;
    }

    static calculateBenchmarksScore(benchmarks) {
        if (!benchmarks || benchmarks.length === 0) return 0;

        const avgScore = benchmarks.reduce((sum, bench) => {
            return sum + bench.score;
        }, 0) / benchmarks.length;

        return avgScore;
    }

    static formatModelResponse(model) {
        return {
            ...model,
            score: this.calculateModelScore(model.characteristics, model.benchmark_results),
            characteristics: this.groupCharacteristicsByCategory(model.characteristics),
            versions: this.sortVersions(model.versions)
        };
    }

    static groupCharacteristicsByCategory(characteristics) {
        if (!characteristics) return {};

        return characteristics.reduce((groups, char) => {
            if (!groups[char.category]) {
                groups[char.category] = [];
            }
            groups[char.category].push(char);
            return groups;
        }, {});
    }

    static sortVersions(versions) {
        if (!versions) return [];
        
        return versions.sort((a, b) => 
            new Date(b.release_date) - new Date(a.release_date)
        );
    }
}

module.exports = ModelUtils; 